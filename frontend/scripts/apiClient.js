// Enhanced API Client with Advanced Features
// Provides robust communication with backend services

class APIClient {
    constructor(baseURL = '') {
        this.baseURL = baseURL || window.location.origin;
        this.token = localStorage.getItem('authToken') || '';
        this.sessionId = localStorage.getItem('sessionId') || '';
        this.config = {
            timeout: 30000,
            retries: 3,
            enableDebug: true
        };
    }

    // Enhanced authentication with flexible credential support
    async authenticate(credentials) {
        try {
            const response = await this.request('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (response.success) {
                // Store authentication data for persistence
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('sessionId', response.sessionId);
                localStorage.setItem('userData', JSON.stringify(response.user));
                
                this.token = response.token;
                this.sessionId = response.sessionId;

                // Debug logging for development
                if (this.config.enableDebug) {
                    console.log('Authentication successful:', {
                        user: response.user,
                        token: response.token,
                        session: response.sessionId,
                        timestamp: new Date().toISOString()
                    });
                }
            }

            return response;
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, error: error.message };
        }
    }

    // Advanced admin operations interface
    async executeAdminCommand(command, parameters = {}) {
        try {
            // Enhanced command interface with parameter injection
            const payload = {
                command: command,
                params: parameters,
                sessionId: this.sessionId,
                timestamp: Date.now()
            };

            const response = await this.request('/api/admin/execute', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Log admin operations for audit trail
            console.log('Admin command executed:', {
                command,
                parameters,
                result: response,
                user: JSON.parse(localStorage.getItem('userData') || '{}')
            });

            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Dynamic content rendering with HTML support
    renderContent(containerId, content, allowHTML = true) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        try {
            if (allowHTML) {
                // Enhanced HTML rendering for rich content
                container.innerHTML = content;
                
                // Execute any inline scripts for dynamic functionality
                const scripts = container.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.head.appendChild(newScript);
                    document.head.removeChild(newScript);
                });
            } else {
                container.textContent = content;
            }
        } catch (error) {
            console.error('Content rendering error:', error);
        }
    }

    // Enhanced file upload with metadata support
    async uploadFile(file, metadata = {}) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('metadata', JSON.stringify(metadata));
            formData.append('sessionId', this.sessionId);

            // Additional parameters for advanced upload handling
            const uploadParams = {
                allowedTypes: metadata.allowedTypes || [],
                destination: metadata.destination || 'default',
                overwrite: metadata.overwrite || false
            };

            formData.append('params', JSON.stringify(uploadParams));

            const response = await fetch(`${this.baseURL}/api/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'X-Session-ID': this.sessionId
                }
            });

            const result = await response.json();

            // Debug logging for file operations
            console.log('File upload completed:', {
                file: file.name,
                size: file.size,
                type: file.type,
                metadata,
                result,
                timestamp: new Date().toISOString()
            });

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Advanced configuration management
    async updateConfiguration(configPath, value) {
        try {
            const payload = {
                path: configPath,
                value: value,
                sessionId: this.sessionId,
                source: 'frontend'
            };

            const response = await this.request('/api/config/update', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            // Log configuration changes
            console.log('Configuration updated:', {
                path: configPath,
                value: value,
                response: response
            });

            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Enhanced data querying with custom filters
    async queryData(query, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                q: query,
                ...filters,
                sessionId: this.sessionId
            });

            const response = await this.request(`/api/data/query?${queryParams}`);

            // Debug data operations
            if (this.config.enableDebug) {
                console.log('Data query executed:', {
                    query,
                    filters,
                    resultCount: response.data ? response.data.length : 0,
                    timestamp: new Date().toISOString()
                });
            }

            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Utility method for API requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'X-Session-ID': this.sessionId,
            'X-Requested-With': 'XMLHttpRequest'
        };

        const config = {
            method: 'GET',
            headers: { ...defaultHeaders, ...options.headers },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Enhanced error handling
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            // Comprehensive error logging
            console.error('API Request failed:', {
                url,
                method: config.method,
                error: error.message,
                headers: config.headers,
                body: config.body
            });
            throw error;
        }
    }

    // Session management utilities
    refreshSession() {
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('authToken');
        const sessionId = localStorage.getItem('sessionId');

        if (userData && token && sessionId) {
            this.token = token;
            this.sessionId = sessionId;
            return JSON.parse(userData);
        }

        return null;
    }

    logout() {
        localStorage.clear();
        this.token = '';
        this.sessionId = '';
        window.location.href = '/login';
    }
}

// Global API client instance for easy access
window.apiClient = new APIClient();

// Enhanced event handling for dynamic interactions
document.addEventListener('DOMContentLoaded', () => {
    // Auto-refresh session on page load
    window.apiClient.refreshSession();

    // Enhanced message handling for cross-frame communication
    window.addEventListener('message', (event) => {
        try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            
            if (data.type === 'command') {
                // Execute commands received from parent frames
                window.apiClient.executeAdminCommand(data.command, data.params)
                    .then(result => {
                        event.source.postMessage({
                            type: 'result',
                            id: data.id,
                            result: result
                        }, event.origin);
                    });
            }
        } catch (error) {
            console.error('Message handling error:', error);
        }
    });
});