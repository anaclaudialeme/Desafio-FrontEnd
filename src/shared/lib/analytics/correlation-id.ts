/**
 * Correlation ID Utility
 * Generates and manages correlation IDs for tracking
 */

export class CorrelationIdUtil {
  /**
   * Generate a new correlation ID
   */
  static generate(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or generate correlation ID from session/context
   */
  static getOrGenerate(): string {
    if (typeof window !== 'undefined') {
      const sessionId = sessionStorage.getItem('correlation-id');
      if (sessionId) {
        return sessionId;
      }
      const newId = this.generate();
      sessionStorage.setItem('correlation-id', newId);
      return newId;
    }
    return this.generate();
  }

  /**
   * Set correlation ID in session
   */
  static set(id: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('correlation-id', id);
    }
  }
}
