// Widget Configuration Types

export type ColumnType = 
  | "id" 
  | "target_binary" 
  | "numeric" 
  | "categorical_low_card" 
  | "categorical_high_card" 
  | "categorical_ordinal";

export type StatType = "min" | "max" | "mean" | "std" | "missing_pct";

export type TransformStep =
  | { name: "impute_numeric"; strategy: "mean" | "median"; columns: string[] }
  | { name: "impute_categorical"; strategy: "most_frequent"; columns: string[] }
  | { name: "add_missing_indicators"; columns: string[] }
  | { name: "one_hot_encode"; drop_first?: boolean; columns: string[] }
  | { name: "scale_numeric"; method: "standard" | "minmax" | "robust"; columns: string[] }
  | { name: "drop_columns"; columns: string[] };

export type FSMethod =
  | { name: "correlation"; supports: Array<"numeric">; score_direction: "abs_higher_better" }
  | { name: "mutual_information"; supports: Array<"numeric" | "categorical">; score_direction: "higher_better" }
  | { name: "model_importance"; model: "random_forest_classifier"; n_estimators: number; max_depth?: number; score_direction: "higher_better" };

export type ScalerConfig =
  | { name: "standard" }
  | { name: "minmax"; feature_range?: [number, number] }
  | { name: "robust" }
  | { name: "log"; epsilon?: number };

export type ModelConfig =
  | { name: "svm_linear"; C: number }
  | { name: "knn"; k: number }
  | { name: "logreg_l2"; C: number }
  | { name: "random_forest"; n_estimators: number; max_depth?: number };

export type MetricType = "f1_macro" | "accuracy" | "precision_macro" | "recall_macro";

// Model Comparison Configuration
export interface ModelComparisonConfig {
  title: string;
  data_url: string;
  target: string;
  models: Array<{
    name: string;
    type: string;
    description: string;
    pros: string[];
    cons: string[];
    use_cases?: string[];
    hyperparameters?: Record<string, any>;
  }>;
  metrics: string[];
  comparison: {
    show_training_time: boolean;
    show_inference_time: boolean;
    show_interpretability: boolean;
    show_memory_usage: boolean;
    show_feature_importance?: boolean;
    show_learning_curves?: boolean;
  };
  visualization?: {
    show_confusion_matrix?: boolean;
    show_roc_curves?: boolean;
    show_feature_importance?: boolean;
    show_learning_curves?: boolean;
  };
  hints?: string[];
  scenarios?: Array<{
    name: string;
    recommended: string[];
    reason: string;
  }>;
}

// Hyperparameter Tuning Configuration
export interface HyperparamTuningConfig {
  title: string;
  data_url: string;
  target: string;
  models: Array<{
    name: string;
    type: string;
    description: string;
    hyperparameters: Record<string, any>;
    importance?: string[];
    tuning_tips?: string[];
  }>;
  search_methods: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    best_for: string;
  }>;
  cv_folds: number;
  metrics: string[];
  max_trials: number;
  visualization?: {
    show_learning_curves?: boolean;
    show_hyperparameter_importance?: boolean;
    show_optimization_history?: boolean;
    show_parallel_coordinates?: boolean;
  };
  hints?: string[];
  scenarios?: Array<{
    name: string;
    description: string;
    method: string;
    max_trials: number;
    focus: string[];
  }>;
}

// CV Visualizer Configuration
export interface CVVisualizerConfig {
  title: string;
  data_url: string;
  target: string;
  models: Array<{
    name: string;
    type: string;
    description: string;
    hyperparameters: Record<string, any>;
  }>;
  cv_strategies: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    best_for: string;
    folds: number[] | string[];
    shuffle: boolean;
  }>;
  metrics: string[];
  visualization?: {
    show_fold_scores?: boolean;
    show_fold_variance?: boolean;
    show_learning_curves?: boolean;
    show_confusion_matrices?: boolean;
    show_fold_distributions?: boolean;
    show_performance_heatmap?: boolean;
    show_fold_comparison?: boolean;
  };
  analysis?: {
    show_stability_metrics?: boolean;
    show_fold_correlation?: boolean;
    show_performance_trends?: boolean;
    show_outlier_detection?: boolean;
  };
  hints?: string[];
  scenarios?: Array<{
    name: string;
    description: string;
    recommended_strategy: string;
    recommended_folds: number | string;
    reason: string;
  }>;
  common_pitfalls?: Array<{
    pitfall: string;
    description: string;
    solution: string;
    example: string;
  }>;
}

// Optimization Lab Configuration
export interface OptimizationLabConfig {
  title: string;
  data_url: string;
  target: string;
  models: Array<{
    name: string;
    type: string;
    description: string;
    optimization_techniques: Array<{
      name: string;
      display_name: string;
      description: string;
      parameters: Record<string, any>;
      effects: string[];
      best_for: string;
    }>;
    hyperparameters: Record<string, any>;
  }>;
  techniques: Array<{
    name: string;
    display_name: string;
    description: string;
    applicable_models: string[];
    pros: string[];
    cons: string[];
  }>;
  metrics: string[];
  visualization?: {
    show_learning_curves?: boolean;
    show_optimization_impact?: boolean;
    show_trade_off_analysis?: boolean;
    show_technique_comparison?: boolean;
  };
  hints?: string[];
  scenarios?: Array<{
    name: string;
    description: string;
    recommended_techniques: string[];
    reason: string;
  }>;
  common_pitfalls?: Array<{
    pitfall: string;
    description: string;
    solution: string;
    example: string;
  }>;
}

// Performance Trade-off Explorer Configuration
export interface PerformanceTradeoffConfig {
  title: string;
  data_url: string;
  target: string;
  models: Array<{
    name: string;
    type: string;
    description: string;
    baseline_metrics: {
      accuracy: number;
      latency_ms: number;
      model_size_mb: number;
      cost_per_prediction: number;
      interpretability_score: number;
    };
    optimization_strategies?: Array<{
      name: string;
      description: string;
      impact: {
        accuracy: number;
        latency_ms: number;
        model_size_mb: number;
        cost_per_prediction: number;
        interpretability_score: number;
      };
    }>;
  }>;
  dimensions: Array<{
    name: string;
    display_name: string;
    description: string;
    unit: string;
    higher_is_better: boolean;
    weight: number;
  }>;
  production_scenarios: Array<{
    name: string;
    description: string;
    constraints: Record<string, number>;
    priority_weights: Record<string, number>;
    recommended_models: string[];
    optimization_strategies: string[];
  }>;
  visualization?: {
    show_3d_scatter?: boolean;
    show_radar_chart?: boolean;
    show_parallel_coordinates?: boolean;
    show_trade_off_matrix?: boolean;
    show_optimization_impact?: boolean;
  };
  hints?: string[];
  common_trade_offs?: Array<{
    trade_off: string;
    description: string;
    solution: string;
    example: string;
  }>;
}

// Deployment Readiness Checker Configuration
export interface DeploymentReadinessConfig {
  title: string;
  data_url: string;
  target: string;
  checks: Array<{
    category: string;
    checks: Array<{
      id: string;
      name: string;
      description: string;
      threshold: number | boolean;
      unit?: string;
      weight: number;
      critical: boolean;
    }>;
  }>;
  scenarios: Array<{
    name: string;
    description: string;
    required_checks: string[];
    optional_checks: string[];
  }>;
  scoring: {
    pass_threshold: number;
    critical_weight: number;
    optional_weight: number;
    bonus_points: Record<string, number>;
  };
  recommendations: {
    high_priority: string[];
    medium_priority: string[];
    low_priority: string[];
  };
  hints?: string[];
}

// Deployment Pipeline Builder Configuration
export interface DeploymentPipelineConfig {
  title: string;
  data_url: string;
  target: string;
  deployment_strategies: Array<{
    name: string;
    type: string;
    description: string;
    icon: string;
    characteristics: {
      latency: string;
      throughput: string;
      cost: string;
      complexity: string;
    };
    use_cases: string[];
    pros: string[];
    cons: string[];
    infrastructure_requirements: string[];
  }>;
  deployment_environments: Array<{
    name: string;
    description: string;
    icon: string;
    characteristics: {
      scalability: string;
      reliability: string;
      cost: string;
      complexity: string;
    };
    platforms: Array<{
      name: string;
      description: string;
      features: string[];
    }>;
    pros: string[];
    cons: string[];
  }>;
  pipeline_components: Array<{
    name: string;
    description: string;
    icon: string;
    types: string[];
  }>;
  scenarios: Array<{
    name: string;
    description: string;
    requirements: {
      latency: string;
      throughput: string;
      cost: string;
      reliability: string;
    };
    recommended_strategy: string;
    recommended_environment: string;
    reason: string;
  }>;
  hints?: string[];
}

// Latency Cost Dashboard Configuration
export interface LatencyCostConfig {
  title: string;
  data_url: string;
  target: string;
  deployment_strategies: Array<{
    name: string;
    type: string;
    baseline_metrics: {
      latency_ms: number;
      cost_per_prediction: number;
      throughput_per_second: number;
      scalability_score: number;
      reliability_score: number;
      complexity_score: number;
    };
    scaling_impact: {
      latency_ms: number;
      cost_per_prediction: number;
      throughput_per_second: number;
      scalability_score: number;
      reliability_score: number;
      complexity_score: number;
    };
    optimization_options: Array<{
      name: string;
      description: string;
      impact: {
        latency_ms: number;
        cost_per_prediction: number;
        throughput_per_second: number;
        scalability_score: number;
        reliability_score: number;
        complexity_score: number;
      };
    }>;
  }>;
  environments: Array<{
    name: string;
    baseline_metrics: {
      latency_ms: number;
      cost_per_prediction: number;
      throughput_per_second: number;
      scalability_score: number;
      reliability_score: number;
      complexity_score: number;
    };
    scaling_impact: {
      latency_ms: number;
      cost_per_prediction: number;
      throughput_per_second: number;
      scalability_score: number;
      reliability_score: number;
      complexity_score: number;
    };
  }>;
  dimensions: Array<{
    name: string;
    display_name: string;
    description: string;
    unit: string;
    higher_is_better: boolean;
    weight: number;
  }>;
  scenarios: Array<{
    name: string;
    description: string;
    requirements: {
      latency_ms: number;
      cost_per_prediction: number;
      throughput_per_second: number;
      scalability_score: number;
      reliability_score: number;
    };
    recommended_strategy: string;
    recommended_environment: string;
    reason: string;
  }>;
  visualization?: {
    show_radar_chart?: boolean;
    show_scatter_plot?: boolean;
    show_cost_analysis?: boolean;
    show_latency_analysis?: boolean;
    show_throughput_analysis?: boolean;
    show_trade_off_matrix?: boolean;
  };
  hints?: string[];
}

// MLOps Workflow Visualizer Configuration
export interface MLOpsWorkflowConfig {
  title: string;
  data_url: string;
  target: string;
  pipeline_stages: Array<{
    name: string;
    id: string;
    description: string;
    icon: string;
    color: string;
    position: { x: number; y: number };
    inputs: string[];
    outputs: string[];
    configurations: Record<string, boolean>;
    tools: string[];
    dependencies: string[];
    estimated_duration: string;
    cost: string;
  }>;
  workflow_templates: Array<{
    name: string;
    description: string;
    stages: string[];
    estimated_duration: string;
    complexity: string;
    cost: string;
  }>;
  interactions: Array<{
    type: string;
    description: string;
    enabled: boolean;
  }>;
  scenarios: Array<{
    name: string;
    description: string;
    trigger: string;
    actions: string[];
    expected_outcome: string;
  }>;
  best_practices: Array<{
    category: string;
    practices: string[];
  }>;
  hints?: string[];
}

// Pipeline Configurator Configuration
export interface PipelineConfiguratorConfig {
  title: string;
  data_url: string;
  target: string;
  stages: Record<string, Record<string, {
    enabled: boolean;
    description: string;
    configurable: boolean;
    default_value: any;
    min_value?: number;
    max_value?: number;
    options?: string[];
    impact: string;
  }>>;
  pipeline_templates: Array<{
    name: string;
    description: string;
    stages: Record<string, Record<string, any>>;
    estimated_cost: string;
    complexity: string;
    suitable_for: string;
  }>;
  configuration_impact: {
    performance: {
      high_impact: string[];
      medium_impact: string[];
      low_impact: string[];
    };
    cost: {
      high_cost: string[];
      medium_cost: string[];
      low_cost: string[];
    };
    complexity: {
      high_complexity: string[];
      medium_complexity: string[];
      low_complexity: string[];
    };
  };
  validation_rules: Array<{
    rule: string;
    description: string;
    condition: string;
  }>;
  hints?: string[];
}

// Model Monitoring Dashboard Configuration
export interface ModelMonitoringConfig {
  title: string;
  data_url: string;
  target: string;
  metrics: Array<{
    name: string;
    display_name: string;
    description: string;
    unit: string;
    higher_is_better: boolean;
    baseline_value: number;
    current_value: number;
    threshold: number;
    status: string;
    trend: string;
  }>;
  dimensions: Array<{
    name: string;
    display_name: string;
    description: string;
    metrics: string[];
    subgroups?: string[];
  }>;
  drift_metrics: Array<{
    name: string;
    display_name: string;
    description: string;
    method: string;
    baseline_value: number;
    current_value: number;
    threshold: number;
    status: string;
    features: string[];
  }>;
  fairness_metrics: Array<{
    name: string;
    display_name: string;
    description: string;
    baseline_value: number;
    current_value: number;
    threshold: number;
    status: string;
    subgroups: string[];
  }>;
  time_series_data: Record<string, Array<{
    timestamp: string;
    value: number;
  }>>;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    timestamp: string;
    status: string;
    acknowledged: boolean;
  }>;
  refresh_rate: string;
  visualization?: {
    show_time_series?: boolean;
    show_drift_analysis?: boolean;
    show_fairness_metrics?: boolean;
    show_alert_history?: boolean;
    show_performance_heatmap?: boolean;
  };
  hints?: string[];
}

// Drift Detection Lab Configuration
export interface DriftDetectionConfig {
  title: string;
  data_url: string;
  target: string;
  drift_methods: Array<{
    name: string;
    display_name: string;
    description: string;
    formula: string;
    threshold: number;
    interpretation: string;
    pros: string[];
    cons: string[];
  }>;
  features: Array<{
    name: string;
    type: string;
    baseline_distribution: Record<string, any>;
    current_distribution: Record<string, any>;
    drift_detected: boolean;
    drift_score: number;
  }>;
  drift_scenarios: Array<{
    name: string;
    description: string;
    simulation: Record<string, any>;
    expected_drift_score: number;
    detection_difficulty: string;
  }>;
  detection_results: {
    overall_drift_detected: boolean;
    drift_severity: string;
    affected_features: string[];
    recommended_actions: string[];
  };
  visualization?: {
    show_distribution_comparison?: boolean;
    show_drift_scores?: boolean;
    show_feature_importance?: boolean;
    show_temporal_drift?: boolean;
    show_statistical_tests?: boolean;
  };
  hints?: string[];
}

// Alert Configurator Configuration
export interface AlertConfiguratorConfig {
  title: string;
  data_url: string;
  target: string;
  thresholds: Record<string, {
    value: number;
    unit: string;
    description: string;
    severity: string;
    enabled: boolean;
  }>;
  alert_channels: Array<{
    name: string;
    display_name: string;
    description: string;
    enabled: boolean;
    recipients?: string[];
    channel?: string;
    service_key?: string;
    url?: string;
    template: string;
    severity_levels: string[];
  }>;
  alert_policies: Array<{
    name: string;
    description: string;
    conditions: string[];
    severity: string;
    channels: string[];
    cooldown_minutes: number;
    enabled: boolean;
  }>;
  escalation_rules: Array<{
    name: string;
    description: string;
    conditions: string[];
    actions: string[];
    enabled: boolean;
  }>;
  alert_templates: Array<{
    name: string;
    subject: string;
    body: string;
    severity: string;
  }>;
  monitoring_schedules: Array<{
    name: string;
    description: string;
    frequency: string;
    metrics: string[];
    enabled: boolean;
  }>;
  alert_history: Array<{
    id: string;
    timestamp: string;
    metric: string;
    value: number;
    threshold: number;
    severity: string;
    status: string;
    acknowledged: boolean;
    channels: string[];
  }>;
  hints?: string[];
}

// Scaling Strategy Simulator Configuration
export interface ScalingStrategyConfig {
  title: string;
  data_url: string;
  target: string;
  strategies: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    best_for: string;
    cost_per_request: number;
    max_throughput: number;
    latency_ms: number;
    scalability_limit: string;
  }>;
  parameters: {
    users: number[];
    latency_target: number;
    cost_limit: number;
    availability_target: number;
    throughput_target: number;
  };
  scaling_scenarios: Array<{
    name: string;
    description: string;
    users: number;
    requests_per_second: number;
    recommended_strategy: string;
    reasoning: string;
  }>;
  cost_analysis: {
    vertical_scaling: {
      base_cost: number;
      cost_per_cpu_core: number;
      cost_per_gpu: number;
      cost_per_memory_gb: number;
      scaling_factor: number;
    };
    horizontal_scaling: {
      base_cost: number;
      cost_per_instance: number;
      cost_per_load_balancer: number;
      cost_per_monitoring: number;
      scaling_factor: number;
    };
  };
  performance_metrics: {
    latency: {
      vertical: {
        baseline: number;
        scaling_factor: number;
        max_improvement: number;
      };
      horizontal: {
        baseline: number;
        scaling_factor: number;
        max_degradation: number;
      };
    };
    throughput: {
      vertical: {
        baseline: number;
        scaling_factor: number;
        max_throughput: number;
      };
      horizontal: {
        baseline: number;
        scaling_factor: number;
        max_throughput: number;
      };
    };
    availability: {
      vertical: {
        baseline: number;
        scaling_factor: number;
        max_availability: number;
      };
      horizontal: {
        baseline: number;
        scaling_factor: number;
        max_availability: number;
      };
    };
  };
  simulation_results: {
    current_configuration: {
      strategy: string;
      instances: number;
      cpu_cores: number;
      memory_gb: number;
      cost_per_month: number;
      max_throughput: number;
      avg_latency: number;
      availability: number;
    };
    recommended_configuration: {
      strategy: string;
      instances: number;
      cpu_cores: number;
      memory_gb: number;
      cost_per_month: number;
      max_throughput: number;
      avg_latency: number;
      availability: number;
    };
  };
  visualization?: {
    show_cost_comparison?: boolean;
    show_performance_tradeoffs?: boolean;
    show_scaling_curves?: boolean;
    show_recommendations?: boolean;
    show_scenario_analysis?: boolean;
  };
  hints?: string[];
}

// Distributed Training Lab Configuration
export interface DistributedTrainingConfig {
  title: string;
  data_url: string;
  target: string;
  models: Array<{
    name: string;
    display_name: string;
    description: string;
    training_time_single: number;
    memory_usage_gb: number;
    parallelizable: boolean;
    communication_overhead: number;
  }>;
  cluster_sizes: number[];
  distributed_strategies: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    best_for: string;
    scaling_efficiency: number;
  }>;
  training_scenarios: Array<{
    name: string;
    description: string;
    dataset_size?: number;
    model_size?: string;
    worker_count?: number;
    recommended_strategy: string;
    optimal_cluster_size: number;
    reasoning: string;
  }>;
  performance_metrics: {
    training_time: {
      baseline: number;
      scaling_factor: number;
      max_speedup: number;
    };
    accuracy: {
      baseline: number;
      scaling_factor: number;
      max_improvement: number;
    };
    memory_usage: {
      baseline: number;
      scaling_factor: number;
      max_reduction: number;
    };
    communication_overhead: {
      baseline: number;
      scaling_factor: number;
      max_overhead: number;
    };
  };
  scaling_curves: {
    data_parallelism: {
      speedup: number[];
      efficiency: number[];
      communication_overhead: number[];
    };
    model_parallelism: {
      speedup: number[];
      efficiency: number[];
      communication_overhead: number[];
    };
    parameter_servers: {
      speedup: number[];
      efficiency: number[];
      communication_overhead: number[];
    };
  };
  cost_analysis: {
    single_machine: {
      cost_per_hour: number;
      training_time_hours: number;
      total_cost: number;
    };
    distributed: {
      cost_per_hour_per_machine: number;
      machines: number;
      training_time_hours: number;
      total_cost: number;
    };
  };
  simulation_results: {
    current_configuration: {
      strategy: string;
      cluster_size: number;
      training_time: number;
      accuracy: number;
      memory_usage: number;
      communication_overhead: number;
    };
    optimized_configuration: {
      strategy: string;
      cluster_size: number;
      training_time: number;
      accuracy: number;
      memory_usage: number;
      communication_overhead: number;
    };
  };
  visualization?: {
    show_scaling_curves?: boolean;
    show_performance_comparison?: boolean;
    show_cost_analysis?: boolean;
    show_strategy_recommendations?: boolean;
    show_efficiency_metrics?: boolean;
  };
  hints?: string[];
}

// Cost Performance Dashboard Configuration
export interface CostPerformanceConfig {
  title: string;
  data_url: string;
  target: string;
  deployment_options: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    cost_per_request: number;
    latency_ms: number;
    throughput_rps: number;
    setup_cost: number;
    maintenance_cost: number;
    best_for: string;
  }>;
  dimensions: Array<{
    name: string;
    display_name: string;
    description: string;
    unit: string;
    lower_is_better: boolean;
    threshold: number;
  }>;
  tradeoff_scenarios: Array<{
    name: string;
    description: string;
    priority: string;
    constraints: Record<string, number>;
    recommended_option: string;
    reasoning: string;
  }>;
  cost_breakdown: Record<string, {
    compute_cost: number;
    storage_cost: number;
    network_cost: number;
    management_cost: number;
    total_cost: number;
  }>;
  performance_analysis: {
    current_deployment: {
      option: string;
      latency: number;
      throughput: number;
      cost_per_request: number;
      accuracy: number;
      availability: number;
    };
    optimization_opportunities: Array<{
      option: string;
      improvement: string;
      tradeoff: string;
      cost_impact: string;
      latency_impact?: string;
    }>;
  };
  scaling_analysis: {
    traffic_growth: {
      current: number;
      projected_6_months: number;
      projected_12_months: number;
    };
    cost_projection: Record<string, {
      current: number;
      "6_months": number;
      "12_months": number;
    }>;
  };
  visualization?: {
    show_cost_comparison?: boolean;
    show_performance_tradeoffs?: boolean;
    show_scaling_projections?: boolean;
    show_optimization_opportunities?: boolean;
    show_tradeoff_analysis?: boolean;
  };
  hints?: string[];
}

// Incident Playbook Simulator Configuration
export interface IncidentPlaybookConfig {
  title: string;
  data_url: string;
  target: string;
  scenarios: Array<{
    name: string;
    display_name: string;
    description: string;
    severity: string;
    symptoms: string[];
    timeline: Array<{
      time: string;
      event: string;
      action: string;
    }>;
    actions: Array<{
      step: number;
      action: string;
      description: string;
      tools: string[];
      duration: string;
      success_criteria: string;
    }>;
    prevention_measures: string[];
  }>;
  incident_response_team: Array<{
    role: string;
    responsibilities: string[];
    escalation_level: string;
  }>;
  communication_channels: Array<{
    channel: string;
    purpose: string;
    audience: string;
  }>;
  post_incident_actions: string[];
  visualization?: {
    show_timeline?: boolean;
    show_actions?: boolean;
    show_team_roles?: boolean;
    show_communication?: boolean;
    show_prevention?: boolean;
  };
  hints?: string[];
}

// Root Cause Analyzer Configuration
export interface RootCauseAnalyzerConfig {
  title: string;
  data_url: string;
  target: string;
  failure_modes: Array<{
    name: string;
    display_name: string;
    description: string;
    common_causes: string[];
    symptoms: string[];
    investigation_steps: string[];
    diagnostic_tools: string[];
  }>;
  investigation_methodology: {
    step_1: {
      name: string;
      description: string;
      activities: string[];
      duration: string;
      outputs: string[];
    };
    step_2: {
      name: string;
      description: string;
      activities: string[];
      duration: string;
      outputs: string[];
    };
    step_3: {
      name: string;
      description: string;
      activities: string[];
      duration: string;
      outputs: string[];
    };
    step_4: {
      name: string;
      description: string;
      activities: string[];
      duration: string;
      outputs: string[];
    };
  };
  diagnostic_checklist: Record<string, string[]>;
  common_root_causes: Array<{
    cause: string;
    description: string;
    failure_mode: string;
    frequency: string;
    prevention: string;
  }>;
  analysis_tools: Array<{
    name: string;
    description: string;
    use_cases: string[];
    tools: string[];
  }>;
  visualization?: {
    show_failure_modes?: boolean;
    show_investigation_steps?: boolean;
    show_diagnostic_tools?: boolean;
    show_root_causes?: boolean;
    show_prevention_measures?: boolean;
  };
  hints?: string[];
}

// Rollback Scenario Lab Configuration
export interface RollbackScenarioConfig {
  title: string;
  data_url: string;
  target: string;
  model_versions: Array<{
    version: string;
    display_name: string;
    description: string;
    deployment_date: string;
    performance_metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      latency_ms: number;
      throughput_rps: number;
    };
    status: string;
    rollback_risk: string;
    rollback_time: string;
    validation_status: string;
  }>;
  rollback_options: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    use_cases: string[];
    process: string[];
    estimated_time: string;
  }>;
  rollback_scenarios: Array<{
    name: string;
    display_name: string;
    description: string;
    severity: string;
    trigger_conditions: string[];
    rollback_target: string;
    reasoning: string;
    validation_required: boolean;
    estimated_downtime: string;
  }>;
  rollback_process: {
    pre_rollback: string[];
    during_rollback: string[];
    post_rollback: string[];
  };
  validation_checks: Array<{
    check: string;
    description: string;
    metrics: string[];
    thresholds: Record<string, number>;
  }>;
  rollback_simulation: {
    current_scenario: string;
    current_version: string;
    target_version: string;
    rollback_type: string;
    steps: Array<{
      step: number;
      action: string;
      description: string;
      duration: string;
      status: string;
    }>;
  };
  best_practices: string[];
  visualization?: {
    show_model_versions?: boolean;
    show_rollback_options?: boolean;
    show_scenarios?: boolean;
    show_process?: boolean;
    show_simulation?: boolean;
  };
  hints?: string[];
}

// Capstone Project Configurations
export interface DeploymentPipelineCapstoneConfig {
  title: string;
  data_url: string;
  target: string;
  stages: Array<{
    name: string;
    display_name: string;
    description: string;
    status: string;
    duration: string;
    dependencies: string[];
    outputs: string[];
    tools: string[];
    validation: Record<string, any>;
  }>;
  integrations: Array<{
    name: string;
    display_name: string;
    description: string;
    status: string;
    triggers?: string[];
    workflows?: string[];
    environments?: string[];
    features?: string[];
    integrations?: string[];
  }>;
  pipeline_metrics: {
    total_duration: string;
    success_rate: number;
    failure_rate: number;
    average_lead_time: string;
    deployment_frequency: string;
    mean_time_to_recovery: string;
  };
  quality_gates: Array<{
    gate: string;
    description: string;
    status: string;
    tools: string[];
    thresholds: Record<string, number>;
  }>;
  deployment_strategies: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    use_case: string;
  }>;
  monitoring_setup: {
    metrics: string[];
    alerts: Array<{
      name: string;
      condition: string;
      severity: string;
      channels: string[];
    }>;
    dashboards: string[];
  };
  visualization?: {
    show_pipeline_flow?: boolean;
    show_stage_status?: boolean;
    show_integrations?: boolean;
    show_metrics?: boolean;
    show_quality_gates?: boolean;
  };
  hints?: string[];
}

export interface ModelMonitoringCapstoneConfig {
  title: string;
  data_url: string;
  target: string;
  metrics: Array<{
    name: string;
    display_name: string;
    description: string;
    unit: string;
    higher_is_better: boolean;
    baseline_value: number;
    current_value: number;
    threshold: number;
    status: string;
    trend: string;
    last_updated: string;
  }>;
  drift_metrics: Array<{
    name: string;
    display_name: string;
    description: string;
    method: string;
    baseline_value: number;
    current_value: number;
    threshold: number;
    status: string;
    features: string[];
    last_updated: string;
  }>;
  fairness_metrics: Array<{
    name: string;
    display_name: string;
    description: string;
    baseline_value: number;
    current_value: number;
    threshold: number;
    status: string;
    subgroups: string[];
    last_updated: string;
  }>;
  business_metrics: Array<{
    name: string;
    display_name: string;
    description: string;
    unit: string;
    higher_is_better: boolean;
    baseline_value: number;
    current_value: number;
    threshold: number;
    status: string;
    trend: string;
    last_updated: string;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    timestamp: string;
    status: string;
    acknowledged: boolean;
    channels: string[];
  }>;
  time_series_data: Record<string, Array<{
    timestamp: string;
    value: number;
  }>>;
  monitoring_configuration: {
    data_collection: Record<string, boolean>;
    drift_detection: Record<string, any>;
    alerting: Record<string, any>;
  };
  dashboard_sections: Array<{
    name: string;
    display_name: string;
    description: string;
    metrics: string[];
    visualization: string;
    refresh_rate: string;
  }>;
  visualization?: {
    show_time_series?: boolean;
    show_drift_analysis?: boolean;
    show_fairness_metrics?: boolean;
    show_business_metrics?: boolean;
    show_alert_history?: boolean;
    show_performance_heatmap?: boolean;
  };
  hints?: string[];
}

export interface RollbackPlaygroundCapstoneConfig {
  title: string;
  data_url: string;
  target: string;
  model_versions: Array<{
    version: string;
    display_name: string;
    description: string;
    deployment_date: string;
    performance_metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      latency_ms: number;
      throughput_rps: number;
    };
    status: string;
    rollback_risk: string;
    rollback_time: string;
    validation_status: string;
    business_impact: {
      customer_retention: number;
      revenue_saved: number;
      false_positive_rate: number;
    };
  }>;
  rollback_scenarios: Array<{
    name: string;
    display_name: string;
    description: string;
    severity: string;
    trigger_conditions: string[];
    rollback_target: string;
    reasoning: string;
    validation_required: boolean;
    estimated_downtime: string;
    business_impact: string;
  }>;
  rollback_options: Array<{
    name: string;
    display_name: string;
    description: string;
    pros: string[];
    cons: string[];
    use_cases: string[];
    process: string[];
    estimated_time: string;
  }>;
  rollback_process: {
    pre_rollback: string[];
    during_rollback: string[];
    post_rollback: string[];
  };
  validation_checks: Array<{
    check: string;
    description: string;
    metrics: string[];
    thresholds: Record<string, number>;
  }>;
  rollback_simulation: {
    current_scenario: string;
    current_version: string;
    target_version: string;
    rollback_type: string;
    steps: Array<{
      step: number;
      action: string;
      description: string;
      duration: string;
      status: string;
      output: string;
    }>;
  };
  incident_response: {
    team_roles: Array<{
      role: string;
      responsibilities: string[];
      escalation_level: string;
    }>;
    communication_channels: Array<{
      channel: string;
      purpose: string;
      audience: string;
    }>;
  };
  best_practices: string[];
  visualization?: {
    show_model_versions?: boolean;
    show_rollback_options?: boolean;
    show_scenarios?: boolean;
    show_process?: boolean;
    show_simulation?: boolean;
    show_incident_response?: boolean;
  };
  hints?: string[];
}

// Dataset Explorer Configuration
export interface DatasetExplorerConfig {
  title: string;
  data_url: string;
  primary_key: string;
  target: string;
  column_types: Record<string, ColumnType>;
  display: {
    show_missing_pct: boolean;
    sample_rows: number;
    stats: StatType[];
  };
  hints?: string[];
}

// Transform Preview Configuration
export interface TransformPreviewConfig {
  title: string;
  data_url: string;
  target: string;
  train_split: number;
  leakage_guard: boolean;
  steps: TransformStep[];
  preview: {
    show_schema_diff: boolean;
    show_feature_count: boolean;
    show_example_rows: number;
  };
}

// Feature Selector Configuration
export interface FeatureSelectorConfig {
  title: string;
  data_url: string;
  target: string;
  methods: FSMethod[];
  cv_compare: {
    folds: number;
    models: Array<
      | { name: "logreg_l2"; penalty: "l2"; C: number }
      | { name: "random_forest"; n_estimators: number; max_depth?: number }
    >;
    k_feature_sets: Array<number | "all">;
  };
  exclude?: string[];
  hints?: string[];
}

// Impute Lab Configuration
export interface ImputeLabConfig {
  title: string;
  data_url: string;
  target: string;
  strategies: { 
    numeric: Array<"mean" | "median">; 
    categorical: Array<"most_frequent"> 
  };
  indicator_cols: string[];
  experiment_grid: Array<{
    name: string;
    numeric_imputer: "mean" | "median";
    categorical_imputer: "most_frequent";
    add_indicators: boolean;
  }>;
  evaluation: { 
    model: "logreg_l2"; 
    metric: MetricType; 
    cv_folds: number 
  };
  leakage_guard: boolean;
  notes?: string[];
}

// Scaling Playground Configuration
export interface ScalingPlaygroundConfig {
  title: string;
  data_url: string;
  target: string;
  numeric_cols: string[];
  scalers: ScalerConfig[];
  models: Array<
    | { name: "svm_linear"; C: number }
    | { name: "knn"; k: number }
    | { name: "logreg_l2"; C: number }
  >;
  compare: { 
    metric: MetricType; 
    cv_folds: number 
  };
  show_before_after_distributions: boolean;
  notes?: string[];
}

// Union type for all widget configs
export type WidgetConfig = 
  | DatasetExplorerConfig
  | TransformPreviewConfig
  | FeatureSelectorConfig
  | ImputeLabConfig
  | ScalingPlaygroundConfig;
