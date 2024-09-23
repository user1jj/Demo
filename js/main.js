console.log('main.js 已加载');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 内容已加载');
    
    // 轮播图功能
    const slides = document.querySelectorAll('.hero-slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    }

    function prevSlide() {
        let index = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(index);
    }

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            nextSlide();
            startAutoSlide();
        });
        prevButton.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            prevSlide();
            startAutoSlide();
        });
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    startAutoSlide();

    // 触摸事件
    const carousel = document.querySelector('.hero-carousel');
    let startX;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            isDragging = false;
            startAutoSlide();
        }
    });

    carousel.addEventListener('touchend', () => {
        isDragging = false;
        startAutoSlide();
    });

    // 鼠标事件（用于桌面端）
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            isDragging = false;
            startAutoSlide();
        }
    });

    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        startAutoSlide();
    });

    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            startAutoSlide();
        }
    });

    // 图片懒加载
    function lazyLoadHeroImages() {
        console.log('开始加载轮播图图片');
        const heroSlides = document.querySelectorAll('.hero-slide');
        console.log('找到的轮播图数量:', heroSlides.length);
        heroSlides.forEach((slide, index) => {
            const src = slide.dataset.src;
            console.log(`加载第 ${index + 1} 张图片:`, src);
            const img = new Image();
            img.onload = () => {
                console.log(`第 ${index + 1} 张图片加载完成`);
                slide.style.backgroundImage = `url(${src})`;
                slide.classList.add('loaded');
            };
            img.onerror = () => {
                console.error(`第 ${index + 1} 张图片加载失败:`, src);
            };
            img.src = src;
        });
    }

    lazyLoadHeroImages();

    // 添加浮动爱心效果
    function createFloatingHearts() {
        const container = document.createElement('div');
        container.className = 'floating-hearts';
        document.body.appendChild(container);

        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, 300);
    }

    createFloatingHearts();

    // 添加鼠标跟随效果
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 添加鼠标点击效果
    document.addEventListener('click', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
    });

    // 检查图片加载
    function checkImageLoading() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                console.error('图片加载失败:', img.src);
            }
        });
    }

    window.addEventListener('load', checkImageLoading);

    // 确保这个函数在 DOMContentLoaded 事件中被调用
    function initializeSlider() {
        showSlide(0); // 显示第一张幻灯片
        startAutoSlide();
    }

    document.addEventListener('DOMContentLoaded', () => {
        initializeSlider();
    });

    // 处理点赞和收藏
    document.addEventListener('DOMContentLoaded', () => {
        const gallery = document.querySelector('.gallery-grid');
        
        gallery.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                const likeBtn = e.target.closest('.like-btn');
                const id = likeBtn.dataset.id;
                const likeCount = likeBtn.querySelector('.like-count');
                const icon = likeBtn.querySelector('i');

                // 切换点赞状态
                if (icon.classList.contains('far')) {
                    icon.classList.replace('far', 'fas');
                    likeCount.textContent = parseInt(likeCount.textContent) + 1;
                } else {
                    icon.classList.replace('fas', 'far');
                    likeCount.textContent = parseInt(likeCount.textContent) - 1;
                }

                // 这里可以发送请求到服务器更新点赞状态
                // updateLike(id);
            }

            if (e.target.closest('.favorite-btn')) {
                const favoriteBtn = e.target.closest('.favorite-btn');
                const id = favoriteBtn.dataset.id;
                const icon = favoriteBtn.querySelector('i');

                // 切换收藏状态
                icon.classList.toggle('far');
                icon.classList.toggle('fas');

                // 这里可以发送请求到服务器更新收藏状态
                // updateFavorite(id);
            }
        });
    });

    // 可以添加这些函数来与服务器通信
    // function updateLike(id) {
    //     // 发送 AJAX 请求到服务器更新点赞状态
    // }

    // function updateFavorite(id) {
    //     // 发送 AJAX 请求到服务器更新收藏状态
    // }

    // 添加这个函数来处理导航
    function handleNavigation() {
        const hash = window.location.hash;
        if (hash === '#ai-chat') {
            document.querySelector('.ai-chat-section').style.display = 'block';
            if (window.initAIChat) {
                window.initAIChat();
            }
        } else {
            document.querySelector('.ai-chat-section').style.display = 'none';
        }
    }

    // 初始加载时处理导航
    handleNavigation();

    // 监听 hash 变化
    window.addEventListener('hashchange', handleNavigation);

    // QQ图标点击事件处理
    document.addEventListener('DOMContentLoaded', function() {
        const qqIcon = document.getElementById('qq-link'); // 确保使用正确的ID
        const qqQrcode = document.getElementById('qq-qrcode');
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        if (qqIcon && qqQrcode) {
            qqIcon.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止默认行为
                e.stopPropagation(); // 阻止事件冒泡
                qqQrcode.style.display = 'block'; // 显示二维码
                overlay.style.display = 'block'; // 显示遮罩层
                console.log('QQ图标被点击，二维码显示');
            });

            overlay.addEventListener('click', function() {
                hideQRCode(); // 隐藏二维码和遮罩层
            });

            qqQrcode.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止点击二维码时关闭
            });

            function hideQRCode() {
                qqQrcode.style.display = 'none'; // 隐藏二维码
                overlay.style.display = 'none'; // 隐藏遮罩层
                console.log('二维码已隐藏');
            }
        } else {
            console.error('QQ图标或二维码元素未找到');
        }
    });
});