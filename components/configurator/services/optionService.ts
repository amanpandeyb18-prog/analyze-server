"use client";

/**
 * Session-based Option Service
 * All operations use session authentication (no tokens)
 */
export const optionService = {
  /**
   * Create a new option (session-based auth)
   */
  async create(input: any): Promise<any> {
    const response = await fetch('/api/option/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 'PLAN_LIMIT') {
        return { success: false, isLimitError: true, error: errorData.error };
      }
      throw new Error(`Failed to create option: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, data: result.data };
  },

  /**
   * Update option (session-based auth)
   */
  async update(input: any): Promise<any> {
    const response = await fetch('/api/option/update', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Failed to update option: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete option (session-based auth)
   */
  async delete(id: string): Promise<any> {
    const response = await fetch(`/api/option/update?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete option: ${response.statusText}`);
    }

    return response.json();
  },
};
