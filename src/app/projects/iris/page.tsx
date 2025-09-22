"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import AlgorithmPicker from "@/components/projects/iris/AlgorithmPicker";
import ConfusionMatrixViz from "@/components/projects/iris/ConfusionMatrixViz";
import RocCurveViz from "@/components/projects/iris/RocCurveViz";
import ThresholdSlider from "@/components/projects/iris/ThresholdSlider";
import MetricsSummary from "@/components/projects/iris/MetricsSummary";
import PyodideRunner from "@/components/projects/iris/PyodideRunner";
import { ArrowLeft, Play, CheckCircle, Brain, Target, BarChart3, Flower2, Award } from "lucide-react";
import Link from "next/link";

const PY_CODE = `# --- IRIS MINI-PROJECT (NumPy-only, no sklearn) ---
import io, json, math, random
import numpy as np

# ===== 0) Data =====
CSV = """sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
4.7,3.2,1.3,0.2,setosa
4.6,3.1,1.5,0.2,setosa
5.0,3.6,1.4,0.2,setosa
5.4,3.9,1.7,0.4,setosa
5.9,3.0,5.1,1.8,virginica
6.9,3.1,5.4,2.1,virginica
6.7,3.1,4.7,1.5,versicolor
6.0,2.9,4.5,1.5,versicolor
5.5,2.3,4.0,1.3,versicolor
6.3,2.5,5.0,1.9,virginica
6.5,3.0,5.2,2.0,virginica
5.7,2.8,4.1,1.3,versicolor
5.1,3.8,1.5,0.3,setosa
5.4,3.7,1.5,0.2,setosa
6.1,2.8,4.7,1.2,versicolor
6.4,2.8,5.6,2.2,virginica
4.9,3.1,1.5,0.1,setosa
5.8,2.7,5.1,1.9,virginica
"""

def load_csv(csv):
    lines = csv.strip().splitlines()
    header = lines[0].split(",")
    rows = [l.split(",") for l in lines[1:]]
    X = np.array([[float(r[0]), float(r[1]), float(r[2]), float(r[3])] for r in rows], dtype=np.float64)
    y_text = [r[4] for r in rows]
    classes = sorted(set(y_text))
    class_to_id = {c:i for i,c in enumerate(classes)}
    y = np.array([class_to_id[t] for t in y_text], dtype=np.int64)
    return X, y, classes

X, y, class_names = load_csv(CSV)
n, d = X.shape
C = len(class_names)

# ===== 1) Standardize =====
eps = 1e-12
mean = X.mean(axis=0)
std = X.std(axis=0) + eps
X = (X - mean) / std

# ===== 2) Stratified train/test split =====
def stratified_split(X, y, test_ratio=0.3, seed=42):
    rng = random.Random(seed)
    idx_by_c = {}
    for i, yi in enumerate(y):
        idx_by_c.setdefault(int(yi), []).append(i)
    train_idx, test_idx = [], []
    for c, idxs in idx_by_c.items():
        rng.shuffle(idxs)
        t = int(len(idxs) * (1 - test_ratio))
        train_idx += idxs[:t]
        test_idx  += idxs[t:]
    rng.shuffle(train_idx); rng.shuffle(test_idx)
    return np.array(train_idx), np.array(test_idx)

train_idx, test_idx = stratified_split(X, y, test_ratio=0.34)
Xtr, Ytr = X[train_idx], y[train_idx]
Xte, Yte = X[test_idx], y[test_idx]

# ===== 3A) KNN =====
def knn_predict(Xtr, Ytr, Xte, k=3):
    preds = []
    # compute distances naively
    for x in Xte:
        dists = np.sqrt(((Xtr - x)**2).sum(axis=1))
        nn = np.argsort(dists)[:k]
        votes = np.bincount(Ytr[nn], minlength=C)
        preds.append(np.argmax(votes))
    # produce "probabilities" by neighbor class fraction (for ROC)
    probs = []
    for x in Xte:
        dists = np.sqrt(((Xtr - x)**2).sum(axis=1))
        nn = np.argsort(dists)[:k]
        counts = np.bincount(Ytr[nn], minlength=C).astype(float)
        probs.append(counts / max(1, counts.sum()))
    return np.array(preds), np.array(probs)

# ===== 3B) Softmax Regression =====
def softmax(z):
    z = z - z.max(axis=1, keepdims=True)
    e = np.exp(z)
    return e / (e.sum(axis=1, keepdims=True) + 1e-12)

def one_hot(y, C):
    oh = np.zeros((y.shape[0], C))
    oh[np.arange(y.shape[0]), y] = 1
    return oh

def softmax_train(X, y, C, lr=0.1, epochs=400, reg=1e-4, seed=0):
    rng = np.random.default_rng(seed)
    n, d = X.shape
    W = rng.normal(scale=0.01, size=(d, C))
    b = np.zeros((1, C))
    Y = one_hot(y, C)
    for _ in range(epochs):
        logits = X @ W + b  # (n,C)
        P = softmax(logits)
        # loss (not returned, but could be logged)
        # grad
        grad_logits = (P - Y) / n
        dW = X.T @ grad_logits + reg * W
        db = grad_logits.sum(axis=0, keepdims=True)
        W -= lr * dW
        b -= lr * db
    return W, b

def softmax_predict(X, W, b):
    P = softmax(X @ W + b)
    pred = P.argmax(axis=1)
    return pred, P

# ===== 4) Metrics =====
def confusion_matrix(y_true, y_pred, C):
    M = np.zeros((C, C), dtype=int)
    for t, p in zip(y_true, y_pred):
        M[int(t), int(p)] += 1
    return M

def precision_recall_f1(y_true, y_pred, C):
    # macro averages
    precs, recs, f1s = [], [], []
    M = confusion_matrix(y_true, y_pred, C)
    for c in range(C):
        tp = M[c, c]
        fp = M[:, c].sum() - tp
        fn = M[c, :].sum() - tp
        prec = tp / (tp + fp + 1e-12)
        rec  = tp / (tp + fn + 1e-12)
        f1   = 2 * prec * rec / (prec + rec + 1e-12)
        precs.append(prec); recs.append(rec); f1s.append(f1)
    return float(np.mean(precs)), float(np.mean(recs)), float(np.mean(f1s)), M

def roc_curve_ovr(y_true, probs, C, pos_class):
    # One-vs-rest ROC for class "pos_class"
    y_bin = (y_true == pos_class).astype(int)
    scores = probs[:, pos_class]
    # thresholds sorted descending
    order = np.argsort(-scores)
    y_bin = y_bin[order]
    scores = scores[order]
    P = y_bin.sum()
    N = len(y_bin) - P
    tps, fps = 0, 0
    tpr_list, fpr_list, thr = [], [], []
    prev = None
    for i in range(len(scores)+1):
        if i>0:
            if y_bin[i-1] == 1: tps += 1
            else: fps += 1
        tpr = tps / (P + 1e-12)
        fpr = fps / (N + 1e-12)
        thr.append(scores[i-1] if i>0 else 1.0)
        tpr_list.append(tpr); fpr_list.append(fpr)
    # AUC via trapezoid
    auc = 0.0
    for i in range(1, len(tpr_list)):
        auc += (fpr_list[i] - fpr_list[i-1]) * (tpr_list[i] + tpr_list[i-1]) / 2.0
    auc = -auc  # because fpr is increasing while we're walking from high->low threshold
    return fpr_list, tpr_list, float(auc)

# ===== 5) Run both models =====
results = {"class_names": class_names}

# KNN
knn_pred, knn_probs = knn_predict(Xtr, Ytr, Xte, k=5)
knn_prec, knn_rec, knn_f1, knn_cm = precision_recall_f1(Yte, knn_pred, C)
knn_rocs = []
for c in range(C):
    fpr, tpr, auc = roc_curve_ovr(Yte, knn_probs, C, c)
    knn_rocs.append({"class": class_names[c], "fpr": fpr, "tpr": tpr, "auc": auc})
results["knn"] = {
    "k": 5,
    "precision_macro": knn_prec,
    "recall_macro": knn_rec,
    "f1_macro": knn_f1,
    "confusion": knn_cm.tolist(),
    "rocs": knn_rocs,
}

# Softmax
W, b = softmax_train(Xtr, Ytr, C, lr=0.2, epochs=800, reg=1e-4, seed=0)
sm_pred, sm_probs = softmax_predict(Xte, W, b)
sm_prec, sm_rec, sm_f1, sm_cm = precision_recall_f1(Yte, sm_pred, C)
sm_rocs = []
for c in range(C):
    fpr, tpr, auc = roc_curve_ovr(Yte, sm_probs, C, c)
    sm_rocs.append({"class": class_names[c], "fpr": fpr, "tpr": tpr, "auc": auc})
results["softmax"] = {
    "precision_macro": sm_prec,
    "recall_macro": sm_rec,
    "f1_macro": sm_f1,
    "confusion": sm_cm.tolist(),
    "rocs": sm_rocs,
}

# Emit for the app to pick up:
print("<<<IRIS_RESULTS_JSON_START>>>")
print(json.dumps(results))
print("<<<IRIS_RESULTS_JSON_END>>>")`;

export default function IrisProjectPage() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [stdout, setStdout] = useState<string>("");
  const [algo, setAlgo] = useState<"knn"|"softmax">("knn");
  const [threshold, setThreshold] = useState(0.5);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const parsed = useMemo(() => {
    const start = stdout.indexOf("<<<IRIS_RESULTS_JSON_START>>>");
    const end = stdout.indexOf("<<<IRIS_RESULTS_JSON_END>>>");
    if (start === -1 || end === -1) return null;
    try {
      const json = stdout.slice(start + "<<<IRIS_RESULTS_JSON_START>>>".length, end).trim();
      return JSON.parse(json);
    } catch { 
      return null; 
    }
  }, [stdout]);

  const displayData = useMemo(() => {
    if (!parsed) return null;
    const model = parsed[algo];
    const cm = model.confusion as number[][];
    const metrics = {
      precision_macro: model.precision_macro as number,
      recall_macro: model.recall_macro as number,
      f1_macro: model.f1_macro as number,
    };
    return { 
      classNames: parsed.class_names as string[], 
      cm, 
      metrics, 
      rocs: model.rocs as any[] 
    };
  }, [parsed, algo, threshold]);

  const onRun = useCallback((out: string) => {
    setStdout(out);
    if (out.includes("<<<IRIS_RESULTS_JSON_END>>>")) {
      setCompleted(true);
    }
  }, []);

  const handleRunStart = () => {
    setIsRunning(true);
    setCompleted(false);
  };

  const handleRunComplete = () => {
    setIsRunning(false);
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Flower2 className="h-8 w-8 text-pink-500" />
            <h1 className={`text-4xl font-bold ${themeClasses.text}`}>
              Mini Project: Iris Classifier
            </h1>
          </div>
          <p className={`text-xl ${themeClasses.text}/70 max-w-3xl mx-auto`}>
            Train KNN and Softmax Regression entirely in your browser using pure NumPy. 
            No installations required - everything runs in Pyodide!
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className={themeClasses.text}>Pure NumPy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className={themeClasses.text}>Zero Install</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className={themeClasses.text}>Full Evaluation</span>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Project Overview
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              This capstone project integrates all concepts from AI Builder Chapter 1
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className={`font-semibold ${themeClasses.text}`}>What You'll Build:</h4>
                <ul className={`space-y-2 ${themeClasses.text}/80`}>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>KNN classifier with k=5 neighbors</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Softmax Regression (multiclass logistic)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Confusion matrices and ROC curves</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Precision, Recall, F1 metrics</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className={`font-semibold ${themeClasses.text}`}>Key Learning:</h4>
                <ul className={`space-y-2 ${themeClasses.text}/80`}>
                  <li className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Algorithm comparison and selection</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Model evaluation techniques</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Visualization and interpretation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Pure Python/NumPy implementation</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Run Training & Evaluation */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Play className="h-5 w-5 mr-2 text-blue-500" />
              Step 1: Run Training & Evaluation
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Execute the machine learning pipeline entirely in your browser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PyodideRunner 
              code={PY_CODE} 
              onStdout={onRun}
              onRunStart={handleRunStart}
              onRunComplete={handleRunComplete}
            />
            {!parsed && !isRunning && (
              <p className={`text-sm ${themeClasses.text}/70 text-center`}>
                Click "Run" above to train both models and see results here.
              </p>
            )}
            {isRunning && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className={`text-sm ${themeClasses.text}/70`}>Training models...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {parsed && (
          <>
            {/* Step 2: Compare Algorithms */}
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                  Step 2: Compare Algorithms
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  Switch between KNN and Softmax Regression to compare performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AlgorithmPicker value={algo} onSelect={setAlgo} />
                <MetricsSummary metrics={displayData!.metrics} />
              </CardContent>
            </Card>

            {/* Step 3: Visualizations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={`${themeClasses.card} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className={`${themeClasses.text} flex items-center`}>
                    <Target className="h-5 w-5 mr-2 text-purple-500" />
                    Confusion Matrix
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    See how well each model predicts each class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConfusionMatrixViz 
                    matrix={displayData!.cm} 
                    classNames={displayData!.classNames} 
                  />
                </CardContent>
              </Card>

              <Card className={`${themeClasses.card} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className={`${themeClasses.text} flex items-center`}>
                    <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
                    ROC Curves (One-vs-Rest)
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    Compare model performance across different thresholds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RocCurveViz rocs={displayData!.rocs} />
                  <ThresholdSlider 
                    value={threshold} 
                    onChange={setThreshold} 
                    disabled={algo === "knn"} 
                  />
                </CardContent>
              </Card>
            </div>

            {/* Step 4: Reflection */}
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Brain className="h-5 w-5 mr-2 text-indigo-500" />
                  Step 3: Reflection & Analysis
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  Think critically about the results and model performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Reflection Questions:</h4>
                    <ul className={`space-y-2 ${themeClasses.text}/80`}>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Which model has better macro-F1? Why do you think this is the case?</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>How do ROC curves differ across classes? Which class is easiest/hardest to predict?</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span>What trade-off changes when you move the threshold for Softmax Regression?</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span>If you could modify the code, what would you try next to improve performance?</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800`}>
                    <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Key Insights:</h4>
                    <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                      <li>• <strong>KNN</strong> is non-parametric and makes decisions based on local neighborhoods</li>
                      <li>• <strong>Softmax Regression</strong> learns global decision boundaries through gradient descent</li>
                      <li>• <strong>ROC curves</strong> show the trade-off between sensitivity and specificity</li>
                      <li>• <strong>Confusion matrices</strong> reveal which classes are most often confused</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Badge */}
            {completed && (
              <Card className={`${themeClasses.card} backdrop-blur-sm border-green-200 dark:border-green-800`}>
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">🌸</div>
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
                    Iris Classifier Builder Badge Earned!
                  </h3>
                  <p className={`${themeClasses.text}/80 mb-6`}>
                    Congratulations! You've successfully built and evaluated machine learning models 
                    entirely in your browser using pure NumPy. You now understand the fundamentals 
                    of algorithm comparison, model evaluation, and visualization.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link href="/learning/builder/chapter1">
                      <Button variant="outline" className={themeClasses.border}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Chapter 1
                      </Button>
                    </Link>
                    <Link href="/learning/builder/chapter2">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        Continue to Chapter 2 →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/learning/builder/chapter1">
            <Button variant="outline" className={themeClasses.border}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapter 1
            </Button>
          </Link>
          
          {completed && (
            <Link href="/learning/builder/chapter2">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Next: Chapter 2 →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
