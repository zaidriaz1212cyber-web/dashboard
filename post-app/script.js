document.addEventListener('DOMContentLoaded', () => {
    // State management
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const maxChars = 280;

    // DOM Elements
    const createPostForm = document.getElementById('create-post-form');
    const postUsername = document.getElementById('post-username');
    const postContent = document.getElementById('post-content');
    const charCounter = document.getElementById('char-counter');
    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Modal Elements
    const editPostModalEl = document.getElementById('editPostModal');
    const editPostModal = new bootstrap.Modal(editPostModalEl);
    const editPostForm = document.getElementById('edit-post-form');
    const editPostIdInput = document.getElementById('edit-post-id');
    const editPostContentInput = document.getElementById('edit-post-content');

    // Initialize Theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    // Initial Render
    renderPosts();

    // Event Listeners
    createPostForm.addEventListener('submit', handleCreatePost);
    postContent.addEventListener('input', updateCharCounter);
    searchInput.addEventListener('input', handleSearch);
    themeToggleBtn.addEventListener('click', toggleTheme);
    editPostForm.addEventListener('submit', handleEditPostSubmit);
    
    // Delegation for post actions (like, edit, delete)
    postsContainer.addEventListener('click', handlePostActions);

    // Functions
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'bi bi-sun-fill text-warning';
            themeToggleBtn.querySelector('span').textContent = 'Light Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'bi bi-moon-fill';
            themeToggleBtn.querySelector('span').textContent = 'Dark Mode';
        }
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function updateCharCounter() {
        const currentLength = postContent.value.length;
        charCounter.textContent = `${currentLength} / ${maxChars}`;
        
        if (currentLength > maxChars) {
            charCounter.classList.add('text-danger');
            charCounter.classList.remove('text-muted');
        } else {
            charCounter.classList.remove('text-danger');
            charCounter.classList.add('text-muted');
        }
    }

    function handleCreatePost(e) {
        e.preventDefault();

        const username = postUsername.value.trim();
        const content = postContent.value.trim();

        if (!username || !content) return;
        
        if (content.length > maxChars) {
            alert(`Post cannot exceed ${maxChars} characters.`);
            return;
        }

        const newPost = {
            id: Date.now().toString(),
            username: username,
            content: content,
            timestamp: new Date().toISOString(),
            likes: 0
        };

        // Add to beginning of array
        posts.unshift(newPost);
        savePosts();
        
        // Reset form
        createPostForm.reset();
        updateCharCounter();
        
        // Clear search and re-render
        searchInput.value = '';
        renderPosts();
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase();
        renderPosts(query);
    }

    function handlePostActions(e) {
        // Find the closest button element that was clicked
        const btn = e.target.closest('button');
        if (!btn) return;

        const postId = btn.dataset.id;
        if (!postId) return;

        if (btn.classList.contains('btn-delete')) {
            deletePost(postId);
        } else if (btn.classList.contains('btn-like')) {
            likePost(postId);
        } else if (btn.classList.contains('btn-edit')) {
            openEditModal(postId);
        }
    }

    function deletePost(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            posts = posts.filter(post => post.id !== id);
            savePosts();
            renderPosts(searchInput.value.toLowerCase());
        }
    }

    function likePost(id) {
        const post = posts.find(post => post.id === id);
        if (post) {
            post.likes += 1;
            savePosts();
            renderPosts(searchInput.value.toLowerCase());
        }
    }

    function openEditModal(id) {
        const post = posts.find(post => post.id === id);
        if (post) {
            editPostIdInput.value = post.id;
            editPostContentInput.value = post.content;
            editPostModal.show();
        }
    }

    function handleEditPostSubmit(e) {
        e.preventDefault();
        
        const id = editPostIdInput.value;
        const newContent = editPostContentInput.value.trim();
        
        if (!newContent) {
            alert('Post content cannot be empty.');
            return;
        }

        const post = posts.find(post => post.id === id);
        if (post) {
            post.content = newContent;
            savePosts();
            renderPosts(searchInput.value.toLowerCase());
            editPostModal.hide();
        }
    }

    function savePosts() {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function formatTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit'
        });
    }

    function renderPosts(filterQuery = '') {
        postsContainer.innerHTML = '';
        
        const filteredPosts = posts.filter(post => 
            post.username.toLowerCase().includes(filterQuery)
        );

        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1"></i>
                    <p class="mt-2">No posts found.</p>
                </div>
            `;
            return;
        }

        filteredPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card shadow-sm post-card mb-3';
            
            // Encode content to prevent XSS
            const escapeHtml = (unsafe) => {
                return unsafe
                     .replace(/&/g, "&amp;")
                     .replace(/</g, "&lt;")
                     .replace(/>/g, "&gt;")
                     .replace(/"/g, "&quot;")
                     .replace(/'/g, "&#039;");
             }

            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                                ${escapeHtml(post.username.charAt(0).toUpperCase())}
                            </div>
                            <div>
                                <h6 class="card-title mb-0 fw-bold">${escapeHtml(post.username)}</h6>
                                <small class="text-muted" style="font-size: 0.8rem;">${formatTime(post.timestamp)}</small>
                            </div>
                        </div>
                        <!-- Mobile Action Dropdown -->
                        <div class="dropdown d-md-none">
                            <button class="btn btn-sm btn-link text-muted text-decoration-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                                <li>
                                    <button class="dropdown-item btn-edit" data-id="${post.id}">
                                        <i class="bi bi-pencil me-2"></i> Edit
                                    </button>
                                </li>
                                <li>
                                    <button class="dropdown-item btn-delete text-danger" data-id="${post.id}">
                                        <i class="bi bi-trash me-2"></i> Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <p class="card-text mt-3 mb-4" style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(post.content)}</p>
                    
                    <hr class="text-muted opacity-25">
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn action-btn btn-like ${post.likes > 0 ? 'liked' : ''}" data-id="${post.id}">
                            <i class="bi ${post.likes > 0 ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            <span>${post.likes}</span> Like${post.likes !== 1 ? 's' : ''}
                        </button>
                        
                        <!-- Desktop Actions -->
                        <div class="d-none d-md-flex gap-2">
                            <button class="btn action-btn btn-edit" data-id="${post.id}">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn action-btn btn-delete" data-id="${post.id}">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            postsContainer.appendChild(card);
        });
    }
});
