"use client";

/**
 * Session-based Category Service
 * All operations use session authentication (no tokens)
 */
export const categoryService = {
  /**
   * Create a new category (session-based auth)
   */
  async create(input: any): Promise<any> {
    const response = await fetch('/api/category/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update category (session-based auth)
   */
  async update(input: any): Promise<any> {
    const response = await fetch('/api/category/update', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete category (session-based auth)
   */
  async delete(id: string): Promise<any> {
    const response = await fetch(`/api/category/update?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.statusText}`);
    }

    return response.json();
  },
};
