# Step 7: 

# Profile Form: Create a ProfileForm in customer/forms.py for updating customer details.

from django import forms
from django.db import IntegrityError
from .models import Customer



from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

from django import forms
from django.contrib.auth.models import User

from django import forms
from django.contrib.auth.models import User

class SignupForm(forms.ModelForm):
    name = forms.CharField(max_length=100, required=True, widget=forms.TextInput(attrs={'placeholder': 'Full Name'}))
    email = forms.EmailField(max_length=200, required=True, widget=forms.EmailInput(attrs={'placeholder': 'Email ID'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

    class Meta:
        model = User
        fields = ['name', 'email', 'password']

    def clean_username(self):
        # Ensure the username (derived from the name field) is unique
        username = self.cleaned_data.get('name')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('This username is already taken. Please choose another one.')
        return username

    def save(self, commit=True):
        user = super(SignupForm, self).save(commit=False)
        # Use name as the username
        user.username = self.cleaned_data['name']
        user.set_password(self.cleaned_data['password'])  # Hash the password
        user.email = self.cleaned_data['email']  # Set the email
        if commit:
            try:
                user.save()
            except IntegrityError:
                raise forms.ValidationError("This username is already taken. Please try a different one.")
        return user

from django import forms
from django.contrib.auth.models import User
from .models import Profile

class UpdateProfileForm(forms.ModelForm):
    first_name = forms.CharField(max_length=100, required=True)
    last_name = forms.CharField(max_length=100, required=True)
    nickname = forms.CharField(max_length=100, required=True)
    date_of_birth = forms.DateField(required=True)
    city = forms.CharField(max_length=100, required=True)
    state = forms.CharField(max_length=100, required=True)
    country = forms.CharField(max_length=100, required=True)
    phone_number = forms.CharField(max_length=100, required=True)
    profile_picture = forms.FileField(required=False)
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('nickname', 'date_of_birth', 'city', 'state', 'country', 'phone_number', 'profile_picture')

    from django import forms
from django.contrib.auth.models import User
from .models import Profile

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('nickname', 'date_of_birth', 'city', 'state', 'country', 'phone_number')

class UpdateUserProfileForm(forms.ModelForm):
    user_form = UserProfileForm
    profile_form = ProfileForm

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

    def __init__(self, *args, **kwargs):
        super(UpdateUserProfileForm, self).__init__(*args, **kwargs)
        self.fields['user_form'] = self.user_form()
        self.fields['profile_form'] = self.profile_form()

    def save(self, commit=True):
        user = super(UpdateUserProfileForm, self).save(commit=False)
        user.first_name = self.cleaned_data['user_form']['first_name']
        user.last_name = self.cleaned_data['user_form']['last_name']
        user.email = self.cleaned_data['user_form']['email']
        if commit:
            user.save()
        profile = user.profile
        profile.nickname = self.cleaned_data['profile_form']['nickname']
        profile.date_of_birth = self.cleaned_data['profile_form']['date_of_birth']
        profile.city = self.cleaned_data['profile_form']['city']
        profile.state = self.cleaned_data['profile_form']['state']
        profile.country = self.cleaned_data['profile_form']['country']
        profile.phone_number = self.cleaned_data['profile_form']['phone_number']
        if commit:
            profile.save()
        return user
    
from django import forms
from .models import Customer

class ProfilePictureForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ['profile_picture']  # Ensure 'profile_picture' is a field in the Customer model
