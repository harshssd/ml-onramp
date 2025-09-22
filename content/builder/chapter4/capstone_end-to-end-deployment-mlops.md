---
id: ai-builder-ch4-capstone
title: Capstone Project – End-to-End Deployment with MLOps
duration_min: 480
prereqs: ["ai-builder-ch4-lesson1", "ai-builder-ch4-lesson2", "ai-builder-ch4-lesson3", "ai-builder-ch4-lesson4", "ai-builder-ch4-lesson5"]
tags: ["capstone","deployment","mlops","production","hands-on"]
project_type: "Hands-On Capstone"
deliverables:
  - "Production-ready ML pipeline"
  - "Model registry with version control"
  - "CI/CD pipeline for ML"
  - "Monitoring + alerting dashboard"
  - "Incident response playbook"
widgets:
  - type: "deployment_pipeline_builder"
    data: "/widgets/deployment_pipeline_capstone.json"
  - type: "model_monitoring_dashboard"
    data: "/widgets/model_monitoring_capstone.json"
  - type: "rollback_playground"
    data: "/widgets/rollback_playground_capstone.json"
goals:
  - Build a production-ready ML service for customer churn prediction
  - Implement end-to-end MLOps pipeline with CI/CD
  - Deploy and monitor ML models in production
  - Create incident response and rollback procedures
  - Document and maintain ML systems
quiz:
  - q: What is the primary purpose of model versioning in MLOps?
    options: ["To improve model accuracy","To track model changes and enable rollbacks","To reduce training time","To increase model complexity"]
    answer: 1
    explain: Model versioning allows tracking of model changes and enables rollbacks to previous stable versions when issues arise.
  - q: Which component is essential for automated ML deployment?
    options: ["Manual testing","CI/CD pipeline","Human approval","Complex algorithms"]
    answer: 1
    explain: CI/CD pipelines automate the testing, validation, and deployment of ML models, ensuring consistent and reliable deployments.
  - q: What is the main benefit of containerizing ML models?
    options: ["Improved accuracy","Consistent deployment environments","Faster training","Better algorithms"]
    answer: 1
    explain: Containerization ensures consistent deployment environments across different systems, reducing deployment issues.
  - q: Why is monitoring critical for production ML systems?
    options: ["To improve model accuracy","To detect performance degradation and system issues","To reduce training costs","To increase model complexity"]
    answer: 1
    explain: Monitoring helps detect performance degradation, data drift, and system issues that could affect model performance in production.
  - q: What is the primary goal of incident response playbooks?
    options: ["To prevent all failures","To provide structured response procedures","To reduce model accuracy","To increase system complexity"]
    answer: 1
    explain: Incident response playbooks provide structured procedures for handling failures and ensuring quick recovery.
flashcards:
  - MLOps: DevOps practices applied to machine learning systems
  - Model Registry: Centralized storage for model versions and metadata
  - CI/CD Pipeline: Continuous integration and deployment for automated ML workflows
  - Containerization: Packaging applications with dependencies for consistent deployment
  - Model Versioning: Tracking and managing different versions of ML models
  - Drift Detection: Monitoring for changes in data distribution or model performance
  - Rollback Strategy: Plan to restore previous stable version during failures
  - Shadow Deployment: Testing new models alongside production without affecting users
  - A/B Testing: Comparing different model versions with real users
  - Model Serving: Deploying models to serve predictions in production
reflection:
  - "How would you design an MLOps pipeline for a high-traffic ML application?"
  - "What are the key challenges in maintaining ML models in production over time?"
next: "ai-builder-track-complete"
---

## Project Brief
You are tasked with **building, deploying, and maintaining a machine learning service** that predicts **customer churn** for a SaaS company.

The project covers the full lifecycle:

1. **Model Development** – Train a churn prediction model on customer data
2. **Containerization & Deployment** – Package and deploy using Docker & Kubernetes
3. **MLOps Pipeline** – Automate training, testing, and deployment with CI/CD
4. **Monitoring & Maintenance** – Implement drift detection, model health dashboards, and alerts
5. **Troubleshooting** – Build rollback and recovery workflows

## Phase 1: Model Development

### 1.1 Dataset Selection and Preparation
- **Dataset**: Use the [Kaggle Telco Customer Churn](https://www.kaggle.com/blastchar/telco-customer-churn) dataset
- **Features**: Customer demographics, account information, services, and billing
- **Target**: Customer churn (binary classification)
- **Data Quality**: Handle missing values, outliers, and data validation

### 1.2 Model Training
- **Baseline Models**: 
  - Logistic Regression
  - Random Forest
  - Gradient Boosting
- **Evaluation Metrics**: Accuracy, Precision, Recall, F1-Score, AUC-ROC
- **Cross-Validation**: 5-fold stratified cross-validation
- **Hyperparameter Tuning**: Grid search or random search

### 1.3 Model Registry
- **MLflow Integration**: Track experiments, models, and artifacts
- **Model Versioning**: Semantic versioning (v1.0, v1.1, v1.2)
- **Metadata**: Performance metrics, training data info, model parameters
- **Artifacts**: Trained models, preprocessing pipelines, feature importance

### 1.4 Model Validation
- **Performance Validation**: Ensure model meets business requirements
- **Bias Testing**: Check for fairness across demographic groups
- **Data Validation**: Verify data quality and schema consistency
- **Model Validation**: Test model on holdout dataset

## Phase 2: Containerization & Deployment

### 2.1 API Development
- **Framework**: FastAPI for high-performance API
- **Endpoints**: 
  - `/predict` - Single prediction
  - `/predict_batch` - Batch predictions
  - `/health` - Health check
  - `/metrics` - Model performance metrics
- **Input Validation**: Pydantic models for request validation
- **Error Handling**: Comprehensive error handling and logging

### 2.2 Docker Containerization
- **Dockerfile**: Multi-stage build for optimization
- **Base Image**: Python 3.9 slim
- **Dependencies**: Requirements.txt with pinned versions
- **Security**: Non-root user, minimal attack surface
- **Size Optimization**: Multi-stage build, layer caching

### 2.3 Kubernetes Deployment
- **Deployment**: Kubernetes deployment manifest
- **Service**: Load balancer service for API access
- **ConfigMap**: Configuration management
- **Secrets**: Secure storage of sensitive data
- **Resource Limits**: CPU and memory constraints
- **Health Checks**: Liveness and readiness probes

### 2.4 Helm Charts
- **Chart Structure**: Standard Helm chart organization
- **Values**: Configurable deployment parameters
- **Templates**: Kubernetes manifest templates
- **Dependencies**: External chart dependencies
- **Testing**: Helm test suite for validation

## Phase 3: MLOps Pipeline

### 3.1 CI/CD Pipeline Setup
- **GitHub Actions**: Automated workflow triggers
- **Triggers**: Code push, pull requests, scheduled runs
- **Stages**: Build, test, deploy, monitor
- **Environments**: Development, staging, production
- **Secrets**: Secure storage of credentials and tokens

### 3.2 Automated Training Pipeline
- **Data Pipeline**: Automated data ingestion and validation
- **Training Pipeline**: Automated model training and validation
- **Model Registry**: Automated model versioning and storage
- **Testing**: Automated model testing and validation
- **Deployment**: Automated deployment to staging/production

### 3.3 Quality Gates
- **Code Quality**: Linting, formatting, security scanning
- **Test Coverage**: Unit tests, integration tests, model tests
- **Performance Tests**: Load testing, latency testing
- **Security Tests**: Vulnerability scanning, dependency checks
- **Model Validation**: Performance thresholds, bias testing

### 3.4 Deployment Strategies
- **Blue-Green Deployment**: Zero-downtime deployments
- **Canary Deployment**: Gradual rollout with monitoring
- **Rolling Deployment**: Incremental updates
- **Feature Flags**: Toggle model versions dynamically

## Phase 4: Monitoring & Maintenance

### 4.1 Monitoring Infrastructure
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **AlertManager**: Alert routing and notification
- **Jaeger**: Distributed tracing
- **ELK Stack**: Log aggregation and analysis

### 4.2 Model Monitoring
- **Performance Metrics**: Accuracy, latency, throughput
- **Data Drift**: Statistical tests for input distribution changes
- **Concept Drift**: Performance degradation over time
- **Bias Monitoring**: Fairness metrics across demographic groups
- **Business Metrics**: Churn prediction accuracy, business impact

### 4.3 Alerting System
- **Thresholds**: Performance and quality thresholds
- **Channels**: Email, Slack, PagerDuty integration
- **Escalation**: Multi-level escalation policies
- **Suppression**: Alert suppression and grouping
- **Runbooks**: Automated response procedures

### 4.4 Dashboard Development
- **Real-time Metrics**: Live performance monitoring
- **Historical Analysis**: Trend analysis and reporting
- **Drift Detection**: Data and concept drift visualization
- **Business Impact**: Revenue and customer impact metrics
- **System Health**: Infrastructure and service health

## Phase 5: Troubleshooting & Recovery

### 5.1 Incident Response
- **Detection**: Automated anomaly detection
- **Classification**: Incident severity and impact assessment
- **Response**: Automated and manual response procedures
- **Communication**: Stakeholder notification and updates
- **Documentation**: Incident logging and analysis

### 5.2 Rollback Procedures
- **Model Rollback**: Automated rollback to previous stable version
- **Data Rollback**: Rollback to previous data state
- **Configuration Rollback**: Rollback to previous configuration
- **Validation**: Post-rollback validation and monitoring
- **Recovery**: System recovery and stability verification

### 5.3 Root Cause Analysis
- **Investigation**: Systematic investigation methodology
- **Analysis**: Root cause identification and validation
- **Documentation**: Incident analysis and lessons learned
- **Prevention**: Preventive measures and process improvements
- **Knowledge Sharing**: Team knowledge transfer and training

### 5.4 Continuous Improvement
- **Post-Mortems**: Regular incident post-mortems
- **Process Improvement**: Workflow and procedure optimization
- **Tool Enhancement**: Monitoring and alerting improvements
- **Training**: Team training and skill development
- **Documentation**: Runbook and procedure updates

## Interactive Exploration
Use the **Deployment Pipeline Builder**, **Model Monitoring Dashboard**, and **Rollback Playground** to:

1. **Design Pipeline**: Build and visualize MLOps pipeline stages
2. **Monitor Performance**: Track model performance and system health
3. **Practice Rollbacks**: Execute rollback procedures safely
4. **Test Scenarios**: Simulate different failure and recovery scenarios
5. **Learn Best Practices**: Understand production MLOps workflows

## Deliverables

### 1. GitHub Repository
- **ML Training Code**: Complete model training pipeline
- **API Code**: FastAPI application with endpoints
- **Dockerfile**: Containerization configuration
- **Kubernetes Manifests**: Deployment and service configurations
- **Helm Charts**: Package management and deployment
- **GitHub Actions**: CI/CD pipeline workflows
- **Documentation**: README, API docs, deployment guides

### 2. Deployed API Endpoint
- **Production URL**: Live API endpoint for predictions
- **Health Check**: System health and status endpoints
- **Sample Predictions**: Example API responses
- **Performance Metrics**: Latency and throughput measurements
- **Error Handling**: Comprehensive error responses

### 3. Monitoring Dashboard
- **Grafana Dashboard**: Model performance visualization
- **Alert Configuration**: Automated alerting setup
- **Drift Detection**: Data and concept drift monitoring
- **Business Metrics**: Revenue and customer impact tracking
- **System Health**: Infrastructure monitoring

### 4. Incident Response Playbook
- **Response Procedures**: Step-by-step incident handling
- **Rollback Procedures**: Model and system rollback steps
- **Communication Plans**: Stakeholder notification procedures
- **Escalation Policies**: Incident escalation and resolution
- **Post-Mortem Templates**: Incident analysis and learning

## Assessment Criteria

### Technical Correctness (25%)
- Model accuracy meets business requirements
- API returns correct predictions
- Containerization and deployment work correctly
- Monitoring and alerting function properly

### Pipeline Automation (25%)
- CI/CD pipeline triggers correctly
- Model versioning and registry work properly
- Automated testing and validation pass
- Deployment automation functions correctly

### Monitoring & Maintenance (25%)
- Dashboard displays relevant metrics
- Alerts trigger appropriately
- Drift detection works correctly
- System health monitoring functions

### Troubleshooting & Recovery (25%)
- Rollback procedures work correctly
- Incident response is well-documented
- Recovery procedures are tested
- Documentation is clear and actionable

## Best Practices

### 1. Model Development
- Use version control for all code and data
- Implement comprehensive testing
- Document model assumptions and limitations
- Validate model performance thoroughly

### 2. Deployment
- Use infrastructure as code
- Implement proper security measures
- Test deployments in staging first
- Monitor deployments closely

### 3. Monitoring
- Set appropriate alert thresholds
- Monitor both technical and business metrics
- Implement comprehensive logging
- Regular review and optimization

### 4. Maintenance
- Regular model retraining
- Continuous monitoring and alerting
- Regular incident response training
- Continuous process improvement

## Common Challenges

### 1. Data Quality
- **Challenge**: Inconsistent or poor quality data
- **Solution**: Implement data validation and quality checks
- **Prevention**: Regular data quality monitoring

### 2. Model Drift
- **Challenge**: Model performance degrades over time
- **Solution**: Implement drift detection and retraining
- **Prevention**: Regular model performance monitoring

### 3. Deployment Issues
- **Challenge**: Complex deployment failures
- **Solution**: Implement rollback procedures and testing
- **Prevention**: Comprehensive testing and validation

### 4. Monitoring Gaps
- **Challenge**: Inadequate monitoring coverage
- **Solution**: Implement comprehensive monitoring
- **Prevention**: Regular monitoring audits and updates

## Quiz
Test your understanding with the quiz questions above.

## Reflection
Think about a production ML system you've worked with. How would you design an MLOps pipeline for a high-traffic ML application? What are the key challenges in maintaining ML models in production over time?

## References
- [MLOps with GitHub Actions (Tutorial)](https://towardsdatascience.com/mlops-with-github-actions-5c223f315c9f)
- [Dockerizing Machine Learning Models](https://docs.docker.com/get-started/)
- [MLflow for Model Registry](https://mlflow.org/docs/latest/model-registry.html)
- [Prometheus & Grafana for ML Monitoring](https://grafana.com/docs/grafana/latest/getting-started/prometheus/)
- [Kubernetes Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
