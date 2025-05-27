from datetime import timedelta
from django.utils import timezone
from django.db import models


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")
    # q = Question.objects.get(pk=some_id)
    # q.choices.all()

    def __str__(self):
        return f"Question {self.id}: {self.question_text}"
    
    def was_published_recently(self):
        now = timezone.now()
        return self.pub_date > now - timedelta(days=1)


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return f"Choice {self.id}: {self.choice_text}"
