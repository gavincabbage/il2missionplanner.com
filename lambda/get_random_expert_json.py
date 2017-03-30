import requests

def lambda_handler(event, context):
	r = requests.get('http://72ag-ded.ru/static/il2missionplanner.json')
	return {
		'statusCode': r.status_code,
		'headers': {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		'body': r.text
	}
