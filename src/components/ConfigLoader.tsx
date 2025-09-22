'use client';

import React, { useState, useEffect } from 'react';

interface ConfigLoaderProps {
  configPath: string;
  children: (config: any, loading: boolean, error: string | null) => React.ReactNode;
}

export default function ConfigLoader({ configPath, children }: ConfigLoaderProps) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(configPath);
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`);
        }
        
        const configData = await response.json();
        setConfig(configData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    if (configPath) {
      loadConfig();
    }
  }, [configPath]);

  return <>{children(config, loading, error)}</>;
}
