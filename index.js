$(document).ready(function () {
  // Load sidebar content
  $('#sidebar')
    .addClass(
      'd-flex flex-column flex-shrink-0 p-3 bg-secondary-subtle text-secondary-subtle"'
    )
    .css({
      width: '280px',
      'min-height': '100vh',
      position: 'sticky',
      top: '0',
    })
    .load('./components/sidebar.html', function () {
      const currentYear = new Date().getFullYear();
      $('#copyrightYear').html(
        `Copyright © ${
          2025 != currentYear ? `2024-${currentYear}` : currentYear
        } nnotwen. <br> All rights reserved.`
      );

      const icon = {
        dark: 'bi-moon-stars-fill',
        light: 'bi-sun-fill',
        auto: 'bi-circle-half',
      };

      //   Set initial theme
      const systemThemeQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );
      let systemTheme = systemThemeQuery.matches ? 'dark' : 'light';
      setTheme(atob(localStorage.getItem('theme') || btoa(systemTheme)));

      //   Handle theme switching on click
      $('[data-bs-theme-value]').click(function () {
        console.log(this);
        setTheme($(this).data('bs-theme-value'));
      });

      function setTheme(theme) {
        $('html').attr('data-bs-theme', theme !== 'auto' ? theme : systemTheme);
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

      if (!profiles.length || !profiles.find((x) => x.id == currentUserId)) {
        $('#profile').html('<i class="bi bi-person-circle me-2"></i>Sign In');
        $('body').append(
          `<div id="signedOutNotification" class="alert alert-warning alert-dismissible fade show opacity-90" style="max-width:350px; position:fixed; top: 20px; right: 20px; z-index: 10000;" role="alert">
                <strong>You are not signed in!</strong> Please sign in to access personalized features.
                <div class="progress mt-2" style="height:4px;">
                    <div class="progress-bar bg-warning" role="progressbar" style="width: 100%; transition: width 10s linear;"></div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        );

        setTimeout(() => {
          $('#signedOutNotification .progress-bar').css('width', '0%');
        }, 1_000);

        setTimeout(() => {
          const $signedOut = $('#signedOutNotification');
          if (!$signedOut.length) return;
          const bsAlert = new bootstrap.Alert($signedOut[0]);
          bsAlert.close();
        }, 11_000);
      } else {
        // Set user profile using custom profile picture
        $('#profile').html(
          `<image src="/assets/images/${
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
          console.log('No profiles found, showing sign up modal');
          $('#signUpModalTitle').text('Create Local Account');
          $('#signUpModalBody')
            .html('')
            .load('./components/sign-up.html', function () {});
        } else if (!profiles.find((x) => x.id === currentUserId)) {
          console.log('No active user found, showing sign up modal');
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

  // Load homepage content
  $('#home')
    .addClass('w-100 vh-100 p-3 overflow-scroll-y')
    .load('./components/home.html', function () {
      const homepageTopics = [
        {
          title: 'Quick Review',
          description:
            'A quick review of the Civil Engineering Licensure Examination topics.',
          link: '/quick-review',
        },
        {
          title: 'Practice Questions',
          description: 'A set of practice questions to test your knowledge.',
          link: '/practice-questions',
        },
        {
          title: 'Exam Strategies',
          description:
            'Tips and strategies for taking the Civil Engineering Licensure Examination.',
          link: '/exam-strategies',
        },
        {
          title: 'Resources',
          description: 'Additional resources to help you prepare for the exam.',
          link: '/resources',
        },
      ];

      for (const item of homepageTopics) {
        $('#homepageTopicSelect').append(
          `<button class="btn text-start d-flex align-items-stretch">
                <div class="text-decoration-none text-secondary-subtle">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                        </div>
                    </div>
                </div>
            </button>`
        );
      }
    });
});
