/**
 * Enhanced Logging Service for Development
 * 
 * Proporciona logging estructurado y debugging para el desarrollo del modelo TensorFlow Lite
 */

import { DEVELOPMENT_CONFIG, LOG_CONFIG, LogLevel, LogPrefix } from '../config/development-config';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  prefix?: LogPrefix;
  message: string;
  data?: any;
  performance?: {
    duration?: number;
    memory?: number;
  };
}

class DevelopmentLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Mantener últimos 1000 logs
  
  private shouldLog(level: LogLevel): boolean {
    if (!DEVELOPMENT_CONFIG.enableDetailedLogging) return false;
    return LOG_CONFIG.levels[level] <= LOG_CONFIG.currentLevel;
  }
  
  private formatMessage(level: LogLevel, prefix: LogPrefix | undefined, message: string): string {
    const levelIcon = LOG_CONFIG.colors[level];
    const prefixIcon = prefix ? LOG_CONFIG.prefixes[prefix] : '';
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // HH:mm:ss.sss
    
    return `${levelIcon} ${prefixIcon} [${timestamp}] ${message}`;
  }
  
  private addLog(level: LogLevel, prefix: LogPrefix | undefined, message: string, data?: any, performance?: any) {
    const logEntry: LogEntry = {
      timestamp: Date.now(),
      level,
      prefix,
      message,
      data,
      performance,
    };
    
    this.logs.push(logEntry);
    
    // Mantener solo los últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
  
  error(message: string, data?: any, prefix?: LogPrefix) {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatMessage('ERROR', prefix, message), data || '');
      this.addLog('ERROR', prefix, message, data);
    }
  }
  
  warn(message: string, data?: any, prefix?: LogPrefix) {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatMessage('WARN', prefix, message), data || '');
      this.addLog('WARN', prefix, message, data);
    }
  }
  
  info(message: string, data?: any, prefix?: LogPrefix) {
    if (this.shouldLog('INFO')) {
      console.info(this.formatMessage('INFO', prefix, message), data || '');
      this.addLog('INFO', prefix, message, data);
    }
  }
  
  debug(message: string, data?: any, prefix?: LogPrefix) {
    if (this.shouldLog('DEBUG')) {
      console.log(this.formatMessage('DEBUG', prefix, message), data || '');
      this.addLog('DEBUG', prefix, message, data);
    }
  }
  
  trace(message: string, data?: any, prefix?: LogPrefix) {
    if (this.shouldLog('TRACE')) {
      console.log(this.formatMessage('TRACE', prefix, message), data || '');
      this.addLog('TRACE', prefix, message, data);
    }
  }
  
  performance(message: string, startTime: number, data?: any, prefix?: LogPrefix) {
    const duration = performance.now() - startTime;
    const performanceData = {
      duration: Math.round(duration * 100) / 100, // Redondear a 2 decimales
      ...data,
    };
    
    if (DEVELOPMENT_CONFIG.debugging.logPerformanceMetrics) {
      this.info(`${message} (${performanceData.duration}ms)`, performanceData, prefix || 'PERFORMANCE');
    }
    
    this.addLog('INFO', prefix || 'PERFORMANCE', message, data, performanceData);
  }
  
  model(message: string, data?: any) {
    this.debug(message, data, 'MODEL');
  }
  
  image(message: string, data?: any) {
    this.debug(message, data, 'IMAGE');
  }
  
  simulation(message: string, data?: any) {
    this.info(message, data, 'SIMULATION');
  }
  
  tflite(message: string, data?: any) {
    this.debug(message, data, 'TFLITE');
  }
  
  /**
   * Obtiene el historial de logs
   */
  getLogs(filterLevel?: LogLevel): LogEntry[] {
    if (!filterLevel) return [...this.logs];
    
    const levelThreshold = LOG_CONFIG.levels[filterLevel];
    return this.logs.filter(log => LOG_CONFIG.levels[log.level] <= levelThreshold);
  }
  
  /**
   * Limpia el historial de logs
   */
  clearLogs() {
    this.logs = [];
  }
  
  /**
   * Exporta logs como string para debugging
   */
  exportLogs(): string {
    return this.logs.map(log => {
      const timestamp = new Date(log.timestamp).toISOString();
      const dataStr = log.data ? JSON.stringify(log.data, null, 2) : '';
      const perfStr = log.performance ? `[${log.performance.duration}ms]` : '';
      
      return `[${timestamp}] ${log.level} ${log.prefix || ''} ${log.message} ${perfStr}\n${dataStr}`;
    }).join('\n\n');
  }
  
  /**
   * Obtiene estadísticas de rendimiento
   */
  getPerformanceStats(): any {
    const perfLogs = this.logs.filter(log => log.performance?.duration);
    
    if (perfLogs.length === 0) return null;
    
    const durations = perfLogs.map(log => log.performance!.duration!);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    
    return {
      count: perfLogs.length,
      averageDuration: Math.round(avg * 100) / 100,
      minDuration: min,
      maxDuration: max,
      totalDuration: Math.round(durations.reduce((a, b) => a + b, 0) * 100) / 100,
    };
  }
}

// Singleton instance
export const devLogger = new DevelopmentLogger();
export default devLogger;
