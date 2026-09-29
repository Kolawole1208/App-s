from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import logging

logger = logging.getLogger(__name__)

AZURE_BASE = 'https://operamadic-chatbox-bbgag9gudhegeeca.westeurope-01.azurewebsites.net'

def dashboard(request):
    return render(request, 'dashboard/dashboard.html')

@csrf_exempt
def proxy_customers(request, subpath=''):
    """
    Development proxy: forwards requests to the Azure customers API.
    Forwards method, query params, body and select headers (Authorization, Content-Type).
    """
    # Build target URL (append subpath if provided)
    base = AZURE_BASE.rstrip('/') + '/api/customers'
    target = base if not subpath else f"{base}/{subpath.lstrip('/')}"
    # Forward selected headers
    forward_headers = {}
    if 'Authorization' in request.headers:
        forward_headers['Authorization'] = request.headers['Authorization']
    if 'Content-Type' in request.headers:
        forward_headers['Content-Type'] = request.headers['Content-Type']

    logger.info("Proxy -> %s %s", request.method, target)
    try:
        resp = requests.request(
            method=request.method,
            url=target,
            headers=forward_headers,
            params=request.GET.dict(),
            data=request.body if request.body else None,
            timeout=20,
        )
    except requests.RequestException as exc:
        return JsonResponse({'error': 'proxy_request_failed', 'details': str(exc)}, status=502)

    # Forward upstream status and body (useful for debugging)
    content_type = resp.headers.get('Content-Type', 'application/json')
    return HttpResponse(resp.content, status=resp.status_code, content_type=content_type)