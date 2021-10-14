from django.db import models


class TypingRecord(models.Model):
    date = models.DateTimeField('recorded')
    speed = models.FloatField(default=0.0)
    accuracy = models.FloatField(default=0.0)

    def __str__(self):
        return f'At {self.date}, speed = {self.speed : .0f} wpm, accuracy = {self.accuracy : .2f}%'
