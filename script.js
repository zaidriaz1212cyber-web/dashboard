document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // Common Striped Pattern
    // ----------------------------------------------------
    const patternCanvas = document.createElement('canvas');
    const patternContext = patternCanvas.getContext('2d');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    patternContext.strokeStyle = '#CBD5E1'; // light slate border color
    patternContext.lineWidth = 2;
    patternContext.beginPath();
    patternContext.moveTo(0, 10);
    patternContext.lineTo(10, 0);
    patternContext.stroke();
    
    // ----------------------------------------------------
    // Dashboard Analytics Bar Chart
    // ----------------------------------------------------
    const analyticsChartEl = document.getElementById('analyticsChart');
    if (analyticsChartEl) {
        const ctxAnalytics = analyticsChartEl.getContext('2d');
        const stripedPattern = ctxAnalytics.createPattern(patternCanvas, 'repeat');

        new Chart(ctxAnalytics, {
            type: 'bar',
            data: {
                labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                datasets: [{
                    label: 'Tasks',
                    data: [60, 80, 100, 120, 70, 90, 80],
                    backgroundColor: [
                        stripedPattern,
                        '#1F7A63', // Solid dark green
                        '#2ECC71', // Solid light green
                        '#1F7A63', // Solid dark green
                        stripedPattern,
                        stripedPattern,
                        stripedPattern
                    ],
                    borderRadius: 20,
                    borderSkipped: false,
                    barThickness: 30
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(31, 122, 99, 0.9)',
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: false,
                    }
                },
                scales: {
                    y: { display: false, beginAtZero: true },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }

    // ----------------------------------------------------
    // Dashboard Progress Donut (Half-Circle) Chart
    // ----------------------------------------------------
    const progressChartEl = document.getElementById('progressChart');
    if (progressChartEl) {
        const ctxProgress = progressChartEl.getContext('2d');
        const stripedPattern = ctxProgress.createPattern(patternCanvas, 'repeat');
        
        new Chart(ctxProgress, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Pending'],
                datasets: [{
                    data: [41, 35, 24],
                    backgroundColor: [
                        '#1F7A63', // Completed
                        '#2ECC71', // In Progress
                        stripedPattern // Pending
                    ],
                    borderWidth: 0,
                    cutout: '75%',
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                },
                rotation: -90,      // Start from left
                circumference: 180, // Half circle
            }
        });
    }

    // ----------------------------------------------------
    // Analytics Page: Revenue Line Chart
    // ----------------------------------------------------
    const revenueChartEl = document.getElementById('revenueChart');
    if (revenueChartEl) {
        const ctxRevenue = revenueChartEl.getContext('2d');
        const gradientRevenue = ctxRevenue.createLinearGradient(0, 0, 0, 400);
        gradientRevenue.addColorStop(0, 'rgba(31, 122, 99, 0.4)');
        gradientRevenue.addColorStop(1, 'rgba(31, 122, 99, 0.0)');

        new Chart(ctxRevenue, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue',
                    data: [30000, 45000, 42000, 60000, 58000, 75000, 90000],
                    borderColor: '#1F7A63',
                    backgroundColor: gradientRevenue,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#1F7A63',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [5, 5] }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }

    // ----------------------------------------------------
    // Analytics Page: Traffic Sources Donut
    // ----------------------------------------------------
    const trafficChartEl = document.getElementById('trafficChart');
    if (trafficChartEl) {
        const ctxTraffic = trafficChartEl.getContext('2d');
        new Chart(ctxTraffic, {
            type: 'doughnut',
            data: {
                labels: ['Organic', 'Direct', 'Referral'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#1F7A63', '#2ECC71', '#94A3B8'],
                    borderWidth: 0,
                    cutout: '70%',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20 } }
                }
            }
        });
    }

    // ----------------------------------------------------
    // Help Page: FAQ Accordion
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all others
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ----------------------------------------------------
    // Settings Page: Save Button Notification
    // ----------------------------------------------------
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Saved!';
            saveBtn.style.backgroundColor = '#2ECC71';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.backgroundColor = '';
            }, 2000);
        });
    }
});
