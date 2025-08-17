exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { action, studentId, updateData, gistId, masterGistId } = JSON.parse(event.body);
        
        // Get GitHub token from environment variable
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        if (!GITHUB_TOKEN) {
            throw new Error('GitHub token not configured');
        }

        const API_BASE = 'https://api.github.com/gists';
        
        // Common headers for GitHub API
        const githubHeaders = {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };

        switch (action) {
            case 'createGist':
                // Create a new gist for the student
                const createResponse = await fetch(API_BASE, {
                    method: 'POST',
                    headers: githubHeaders,
                    body: JSON.stringify({
                        description: `CSCI 5603 - Student ${studentId} Progress`,
                        public: false,
                        files: {
                            [`student_${studentId}.json`]: {
                                content: JSON.stringify(updateData, null, 2)
                            }
                        }
                    })
                });

                if (!createResponse.ok) {
                    throw new Error(`Failed to create gist: ${createResponse.status}`);
                }

                const newGist = await createResponse.json();
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ id: newGist.id, success: true })
                };

            case 'updateGist':
                // Update existing student gist
                const updateResponse = await fetch(`${API_BASE}/${gistId}`, {
                    method: 'PATCH',
                    headers: githubHeaders,
                    body: JSON.stringify({
                        files: {
                            [`student_${studentId}.json`]: {
                                content: JSON.stringify(updateData, null, 2)
                            }
                        }
                    })
                });

                if (!updateResponse.ok) {
                    throw new Error(`Failed to update gist: ${updateResponse.status}`);
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            case 'updateMasterConfig':
                // First, fetch the current master config
                const fetchResponse = await fetch(`${API_BASE}/${masterGistId}`, {
                    headers: githubHeaders
                });

                if (!fetchResponse.ok) {
                    throw new Error(`Failed to fetch master config: ${fetchResponse.status}`);
                }

                const masterGist = await fetchResponse.json();
                const config = JSON.parse(masterGist.files['csci5603-config.json'].content);

                // Update the config with new student
                if (!config.students) {
                    config.students = {};
                }
                config.students[studentId] = gistId;

                // Update the master gist
                const masterUpdateResponse = await fetch(`${API_BASE}/${masterGistId}`, {
                    method: 'PATCH',
                    headers: githubHeaders,
                    body: JSON.stringify({
                        files: {
                            'csci5603-config.json': {
                                content: JSON.stringify(config, null, 2)
                            }
                        }
                    })
                });

                if (!masterUpdateResponse.ok) {
                    throw new Error(`Failed to update master config: ${masterUpdateResponse.status}`);
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid action' })
                };
        }
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};