---
id: ai-builder-ch4-lesson3
title: Model Monitoring & Maintenance
duration_min: 60
prereqs: ["ai-builder-ch4-lesson1", "ai-builder-ch4-lesson2"]
tags: ["intermediate","monitoring","maintenance","drift","alerts"]
video:
  platform: youtube
  id: 7x8R2aJx0a0
  start: 0
  end: 720
widgets:
  - type: "model_monitoring_dashboard"
    data: "/widgets/model_monitoring.titanic.json"
  - type: "drift_detection_lab"
    data: "/widgets/drift_detection.titanic.json"
  - type: "alert_configurator"
    data: "/widgets/alert_config.titanic.json"
goals:
  - Understand why monitoring ML models in production is critical
  - Learn techniques for detecting data drift and concept drift
  - Set up monitoring for latency, throughput, and fairness
  - Design feedback loops for retraining and maintenance
quiz:
  - q: What is the difference between data drift and concept drift?
    options: ["Data drift = labels change, concept drift = features change","Data drift = input distribution shifts, concept drift = input-output relationship shifts","Both mean the same","Data drift = model performance drops, concept drift = data quality drops"]
    answer: 1
    explain: Data drift refers to changes in the input data distribution, while concept drift refers to changes in the relationship between inputs and outputs.
  - q: Why are canary releases useful?
    options: ["They prevent overfitting","They reduce risk when rolling out new models","They improve interpretability","They reduce training time"]
    answer: 1
    explain: Canary releases allow gradual rollout of new models to a small subset of users, reducing the risk of widespread failures if issues are discovered.
  - q: Which monitoring tool detects feature distribution changes?
    options: ["Monitoring Dashboard","Drift Detection Lab","Alert Configurator","Model Registry"]
    answer: 1
    explain: The Drift Detection Lab specifically focuses on detecting changes in feature distributions using statistical tests like PSI and KL divergence.
  - q: What is the primary purpose of model monitoring in production?
    options: ["To improve model accuracy","To detect performance degradation and maintain model health","To reduce training costs","To increase model complexity"]
    answer: 1
    explain: Model monitoring is primarily used to detect performance degradation, data drift, and other issues that could affect model health in production.
flashcards:
  - Model Drift: Degradation of model performance over time due to changing data or environment
  - Data Drift: Changes in input data distribution that affect model performance
  - Concept Drift: Changes in the relationship between inputs and outputs over time
  - Model Monitoring: Continuous tracking of model performance and health in production
  - Alerting: Automated notifications when model performance drops below thresholds
  - Canary Release: Gradual rollout of new models to a small subset of users
  - Feedback Loop: System to capture user corrections and improve model performance
  - Model Maintenance: Ongoing activities to keep models performing well in production
reflection:
  - "How would you design a comprehensive monitoring system for a production ML model?"
  - "What are the key challenges in detecting and responding to model drift?"
next: "ai-builder-ch4-lesson4"
---

## Introduction
Once a model is live, its job isn't done.

- **Data changes**, environments shift, and user behavior evolves
- Without **monitoring and maintenance**, model performance decays over time (a phenomenon called **model drift**)

## Key Monitoring Dimensions

### Prediction Performance
- **Purpose**: Track model accuracy and performance metrics
- **Key Metrics**:
  - Accuracy, precision, recall, F1-score
  - AUC-ROC, AUC-PR for classification
  - RMSE, MAE, R² for regression
- **Detection**: Compare current performance to baseline
- **Tools**: MLflow, Weights & Biases, custom dashboards
- **Best Practices**: Set performance thresholds, track trends over time

### Latency & Throughput
- **Purpose**: Ensure models meet SLA requirements
- **Key Metrics**:
  - Response time (latency)
  - Requests per second (throughput)
  - Resource utilization (CPU, memory, GPU)
- **Detection**: Monitor against SLA thresholds
- **Tools**: Prometheus, Grafana, APM tools
- **Best Practices**: Set latency alerts, monitor resource usage

### Data Drift
- **Purpose**: Detect changes in input data distribution
- **Key Metrics**:
  - Population Stability Index (PSI)
  - KL Divergence
  - Chi-square test
  - Wasserstein distance
- **Detection**: Statistical tests comparing current vs baseline data
- **Tools**: Evidently AI, Great Expectations, custom drift detectors
- **Best Practices**: Monitor key features, set drift thresholds

### Concept Drift
- **Purpose**: Detect changes in input-output relationships
- **Key Metrics**:
  - Performance degradation
  - Prediction confidence changes
  - Feature importance shifts
- **Detection**: Monitor model performance and prediction patterns
- **Tools**: Custom monitoring, performance tracking
- **Best Practices**: Track performance trends, monitor prediction confidence

### Fairness & Bias
- **Purpose**: Ensure fair performance across demographic groups
- **Key Metrics**:
  - Demographic parity
  - Equalized odds
  - Calibration across groups
- **Detection**: Compare performance across subgroups
- **Tools**: Fairlearn, Aequitas, custom fairness monitors
- **Best Practices**: Regular bias audits, subgroup performance tracking

## Maintenance Practices

### 1. Alerting
- **Purpose**: Trigger alerts when performance drops below thresholds
- **Key Components**:
  - Performance thresholds
  - Alert channels (email, Slack, PagerDuty)
  - Escalation policies
  - Alert suppression rules
- **Best Practices**: Set appropriate thresholds, avoid alert fatigue

### 2. Logging
- **Purpose**: Store predictions, features, and outcomes for analysis
- **Key Components**:
  - Prediction logs
  - Feature values
  - Ground truth labels (when available)
  - Model metadata
- **Best Practices**: Structured logging, data retention policies

### 3. Retraining
- **Purpose**: Automate retraining pipelines on fresh data
- **Key Components**:
  - Retraining triggers
  - Data validation
  - Model validation
  - Deployment automation
- **Best Practices**: Automated retraining, validation gates

### 4. Canary Releases
- **Purpose**: Gradually roll out new models to reduce risk
- **Key Components**:
  - Traffic splitting
  - A/B testing
  - Performance comparison
  - Rollback capability
- **Best Practices**: Start with small traffic, monitor closely

### 5. Feedback Loops
- **Purpose**: Capture user corrections and improve model performance
- **Key Components**:
  - User feedback collection
  - Feedback processing
  - Model updates
  - Performance tracking
- **Best Practices**: Easy feedback collection, automated processing

## Interactive Exploration
Use the **Model Monitoring Dashboard**, **Drift Detection Lab**, and **Alert Configurator** to:

1. **Monitor Performance**: Track accuracy, latency, and fairness in real-time
2. **Detect Drift**: Simulate and detect data drift using statistical tests
3. **Configure Alerts**: Set up automated alerts for performance degradation
4. **Analyze Trends**: Understand how model performance changes over time
5. **Test Scenarios**: Simulate different drift scenarios and responses

## Monitoring Architecture

### 1. Data Collection
- **Prediction Logging**: Log all model predictions and inputs
- **Performance Tracking**: Track accuracy and other metrics
- **System Metrics**: Monitor latency, throughput, resource usage
- **User Feedback**: Collect user corrections and feedback

### 2. Data Processing
- **Real-time Processing**: Process metrics in real-time
- **Batch Processing**: Aggregate metrics over time periods
- **Drift Detection**: Run statistical tests on data distributions
- **Anomaly Detection**: Identify unusual patterns in metrics

### 3. Alerting System
- **Threshold Monitoring**: Check metrics against thresholds
- **Alert Generation**: Generate alerts when thresholds are exceeded
- **Alert Routing**: Route alerts to appropriate teams
- **Escalation**: Escalate unresolved alerts

### 4. Dashboard and Visualization
- **Real-time Dashboards**: Display current model performance
- **Historical Analysis**: Show trends over time
- **Drift Visualization**: Visualize data drift and concept drift
- **Alert Management**: Manage and acknowledge alerts

## Common Monitoring Challenges

### 1. Alert Fatigue
- **Problem**: Too many alerts leading to ignored notifications
- **Solution**: Set appropriate thresholds, use alert suppression
- **Prevention**: Regular threshold review, alert prioritization

### 2. False Positives
- **Problem**: Alerts triggered by normal variations
- **Solution**: Use statistical significance tests, adjust thresholds
- **Prevention**: Baseline establishment, trend analysis

### 3. Delayed Detection
- **Problem**: Drift detected too late, affecting users
- **Solution**: Real-time monitoring, faster detection algorithms
- **Prevention**: Continuous monitoring, automated detection

### 4. Data Quality Issues
- **Problem**: Poor quality data affecting drift detection
- **Solution**: Data validation, quality checks
- **Prevention**: Data quality monitoring, validation pipelines

## Monitoring Best Practices

### 1. Start Simple
- **Begin with basic metrics**: Accuracy, latency, throughput
- **Add complexity gradually**: Drift detection, fairness monitoring
- **Focus on critical metrics**: Those that impact business outcomes

### 2. Set Appropriate Thresholds
- **Use historical data**: Establish baselines from training data
- **Consider business impact**: Set thresholds based on business requirements
- **Regular review**: Update thresholds based on performance trends

### 3. Implement Comprehensive Logging
- **Log everything**: Predictions, features, outcomes
- **Structured logging**: Use consistent formats for easy analysis
- **Data retention**: Implement appropriate retention policies

### 4. Automate Responses
- **Automated retraining**: Trigger retraining when drift is detected
- **Automated rollback**: Rollback to previous model on performance issues
- **Automated alerts**: Send alerts to appropriate teams

### 5. Regular Review
- **Performance review**: Regular analysis of model performance
- **Threshold review**: Update thresholds based on new data
- **Process improvement**: Continuously improve monitoring processes

## Quiz
Test your understanding with the quiz questions above.

## Reflection
Think about a production ML model you've worked with. How would you design a comprehensive monitoring system for it? What are the key challenges in detecting and responding to model drift?

## References
- [EvidentlyAI: Open-source ML Monitoring](https://evidentlyai.com/)
- [Google Cloud: Model Monitoring](https://cloud.google.com/vertex-ai/docs/model-monitoring)
- [Why ML Models Degrade](https://arxiv.org/abs/1810.03993)
