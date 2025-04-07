from django import forms

class SelfIntroForm(forms.Form):
    self_intro = forms.CharField(widget=forms.Textarea)
    jd_highlight = forms.CharField()