# Generated by Django 5.1.4 on 2024-12-26 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0004_alter_item_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='current_holder',
        ),
        migrations.RemoveField(
            model_name='item',
            name='img_path',
        ),
        migrations.AddField(
            model_name='item',
            name='FirtstName',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='имя пользователя'),
        ),
        migrations.AddField(
            model_name='item',
            name='SecondtName',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='фамилия пользователя'),
        ),
        migrations.AlterField(
            model_name='item',
            name='name',
            field=models.CharField(max_length=255, verbose_name='название инвентаря'),
        ),
        migrations.AlterField(
            model_name='item',
            name='status',
            field=models.IntegerField(choices=[(0, 'сломано'), (1, 'в норме'), (2, 'новое')], verbose_name='статус'),
        ),
    ]
