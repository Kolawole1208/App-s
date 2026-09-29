#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()

# Note: shell commands (curl) must not be placed inside this Python file.
# To test the Chat API, run the following curl command in a terminal (not in manage.py):
#
# curl -v -X POST "http://localhost:3000/api/Chat/get-response" \
#   -H "Content-Type: application/json" \
#   -d '{"userId":"123","message":"Hello"}'
