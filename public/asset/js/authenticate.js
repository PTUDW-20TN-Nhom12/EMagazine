const { createClient } = supabase

const SUPABASE_URL = 'https://iuprtgkypnvwgkhrpbcz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cHJ0Z2t5cG52d2draHJwYmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk0OTYyMTQsImV4cCI6MTk5NTA3MjIxNH0.uM1bPaWeGukhOP5AyNN2LO5wfT1-21uYSNI3f3hZIwg'
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function signInWithFacebook() {
  const { data, error } = await _supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: location.protocol + '//' + location.host + '/oauth'
    }
  })
}

async function signInWithGoogle() {
  const { data, error } = await _supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: location.protocol + '//' + location.host + '/oauth'
      }
  })
}

async function signUpWithEmail() { 
  const name = $('#name').val().trim(); 
  const email = $('#email').val().trim();
  const password = $('#password').val().trim();
  const birthday = $('#birthday').val().trim();
  const repassword = $('#repassword').val().trim();
  const role = $('#user_type').text().trim(); 

  const data = {
      name: name,
      email: email,
      birthday: birthday,
      role: role,
      password: password,
      repassword: repassword,
  };

  $.ajax({
      url: '/signup',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: async function(response) {
        const { data, error } = await _supabase.auth.signUp({
          email: email,
          password: password,
        });
        
        // retry 5 times 
        if (error) { 
          for (let i = 0; i < 5; ++i) { 
            const { data, error } = await _supabase.auth.resend({
              type: 'signup',
              email: email
            });
            
            if (!error) { 
              break;
            }
          }
        }

        window.location.href = '/';
      },
      error: function(error) {
          console.log(error); 
          const errorTextDiv = document.querySelector("#error-text");
          errorTextDiv.textContent = error.responseJSON.error;
      }
  });
}

async function signOut() {
  const { error } = await _supabase.auth.signOut()
}