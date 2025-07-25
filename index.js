$(document).ready(function () {
  // Load sidebar content
  const sidebarClass =
    'd-flex flex-column flex-shrink-0 p-3 bg-secondary-subtle text-secondary-subtle';
  const sidebarCSS = {
    width: '280px',
    'min-height': '100vh',
    position: 'sticky',
    top: '0',
  };
  const sidebarTopics = [
    {
      title: 'Home',
      description: 'Return to the home page.',
      icon: 'bi-house-door-fill',
      tabId: 'home',
    },
    {
      title: 'Assessment',
      description:
        'A comprehensive assessment to evaluate your current knowledge and skills in civil engineering.',
      icon: 'bi-clipboard-check',
      tabId: 'assessment',
    },
    {
      title: 'Exam Strategies',
      description:
        'Tips and strategies for taking the Civil Engineering Licensure Examination.',
      icon: 'bi-lightbulb-fill',
      tabId: 'exam-strategies',
    },
    {
      title: 'Resources',
      description: 'Additional resources to help you prepare for the exam.',
      icon: 'bi-journal-bookmark-fill',
      tabId: 'resources',
    },
    {
      title: 'Stats',
      description:
        'Track your progress and performance with detailed statistics.',
      icon: 'bi-bar-chart-fill',
      tabId: 'stats',
    },
  ];

  for (const topic of sidebarTopics) {
    $.get('./components/tabs/' + topic.tabId + '.html', function (data) {
      $('#main').append(
        $(data).addClass('tab-pane fade').attr('id', topic.tabId)
      );
      if (topic.tabId === 'home') {
        $('#' + topic.tabId).addClass('show active');
      }
    });
  }

  $('#sidebar')
    .addClass(sidebarClass)
    .css(sidebarCSS)
    .load('./components/sidebar.html', function () {
      for (const topic of sidebarTopics) {
        $(this)
          .find('#sidebarTopics')
          .append(
            `<li class="nav-item">
              <div class="btn text-start nav-link text-body" data-bs-toggle="tab" data-bs-target="#${topic.tabId}" aria-current="page">
                <i class="bi ${topic.icon} me-2"></i>
                ${topic.title}
              </div>
            </li>`
          );
      }

      $("[data-bs-target='#home']").addClass('active');

      const currentYear = new Date().getFullYear();
      $('#copyrightYear').html(
        `Copyright © ${
          2025 != currentYear ? `2024-${currentYear}` : currentYear
        } nnotwen. <br> All rights reserved.`
      );

      // Setup page theme when sidebar is loaded
      const icon = {
        dark: 'bi-moon-stars-fill',
        light: 'bi-sun-fill',
        auto: 'bi-circle-half',
      };

      //   Set initial theme
      const systemDarkMode = '(prefers-color-scheme: dark)';
      const getSystemTheme = () =>
        window.matchMedia(systemDarkMode).matches ? 'dark' : 'light';

      setTheme(atob(localStorage.getItem('theme') || btoa(getSystemTheme())));

      //   Handle theme switching on click
      $('[data-bs-theme-value]').click(function () {
        setTheme($(this).data('bs-theme-value'));
      });

      function setTheme(theme) {
        $('html').attr(
          'data-bs-theme',
          theme !== 'auto' ? theme : getSystemTheme()
        );
        localStorage.setItem('theme', btoa(theme));

        // Update the icon based on the selected theme
        $('#themeSelector i')
          .removeClass(Object.values(icon).filter((i) => i !== icon[theme]))
          .addClass(Object.values(icon).find((i) => i === icon[theme]));

        //   Update the active state in the dropdown menu
        $('#themeSelectorMenu .active')
          .removeClass('active')
          .find('.bi-check2')
          .remove();
        $(`#themeSelectorMenu [data-bs-theme-value="${theme}"]`)
          .addClass('active')
          .append('<i class="bi-check2 ms-auto"></i>');
      }

      //  Profiles Manager
      let profiles = localStorage.getItem('users')
        ? JSON.parse(localStorage.getItem('users'))
        : [];
      let currentUserId = localStorage.getItem('activeUserId');

      // Set profile icon and add notification if user is signed out
      if (!profiles.length || !profiles.find((x) => x.id == currentUserId)) {
        $('#profile').html('<i class="bi bi-person-circle me-2"></i>Sign In');
        $.get('./components/signed-out-notification.html', function (data) {
          const $notif = $(data);
          $('.notification-pane').append($notif);

          // Animate progress bar
          setTimeout(() => {
            $notif.find('.progress-bar').css('width', '0%');
          }, 250);

          // Fade out and remove notification after 10 seconds
          setTimeout(() => {
            $notif.fadeOut(500, function () {
              $notif.remove();
            });
          }, 10_250);
        });
      } else {
        // Set user profile using custom profile picture
        $('#profile').html(
          `<image src="./assets/images/${
            profiles.find((x) => x.id == currentUserId).avatar
          }.png" class="rounded-circle me-2" style="width: 24px; height: 24px;">` +
            `<span class="d-none d-sm-inline">${
              profiles.find((x) => x.id == currentUserId).username
            }</span>`
        );
      }

      $('#profile').click(function () {
        profiles = localStorage.getItem('users')
          ? JSON.parse(localStorage.getItem('users'))
          : [];
        currentUserId = localStorage.getItem('activeUserId');

        if (!profiles.length) {
          $('#signUpModalTitle').text('Create Local Account');
          $('#signUpModalBody')
            .html('')
            .load('./components/sign-up.html', function () {});
        } else if (!profiles.find((x) => x.id === currentUserId)) {
          $('#signUpModalTitle').text('Sign In');
          $('#signUpModalBody')
            .html('')
            .load('./components/account-chooser.html', function () {});
        }
      });

      $(document).on('click', '[data-bs-toggle="modal"]', function () {
        const target = $(this).data('bs-target');
        $(target).appendTo('body');
      });
    });
});
