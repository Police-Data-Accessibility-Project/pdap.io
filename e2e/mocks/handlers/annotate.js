import { http, HttpResponse } from 'msw';

const TEST_SESSION_ID = '00000000-0000-4000-8000-000000000001';

function buildNextAnnotation() {
  return {
    next_annotation: {
      url_info: {
        url: 'https://example.gov/police/records',
        url_id: 1
      },
      html_info: {
        index: 0,
        url: 'https://example.gov/police/records',
        url_path: '/police/records',
        title: 'Example PD Records',
        description: 'Public records portal for the Example Police Department.',
        http_response: 200,
        h1: 'Records Portal',
        h2: '',
        h3: '',
        h4: '',
        h5: '',
        h6: '',
        div: ''
      },
      batch_info: {
        count_annotated: 0,
        total_urls: 10,
        count_not_annotated: 10
      },
      agency_suggestions: {
        suggestions: [
          {
            id: 101,
            display_name: 'Example Police Department',
            user_count: 3,
            robo_confidence: 0.92
          }
        ]
      },
      location_suggestions: {
        suggestions: [
          {
            id: 201,
            display_name: 'Example City, EX',
            user_count: 2,
            robo_confidence: 0.85
          }
        ]
      },
      url_type_suggestions: [{ url_type: 'data source', endorsement_count: 4 }],
      record_type_suggestions: {
        suggestions: [
          {
            record_type: 'Incident Reports',
            user_count: 2,
            robo_confidence: 0.8
          }
        ]
      },
      name_suggestions: {
        suggestions: [
          {
            id: 301,
            display_name: 'Daily Incident Log',
            user_count: 1,
            robo_count: 0
          }
        ]
      }
    },
    session_id: TEST_SESSION_ID
  };
}

export const annotateHandlers = [
  // Anonymous GET — wildcard matches whatever VITE_SM_API_URL resolves to
  http.get('*/annotate/anonymous', () => {
    return HttpResponse.json(buildNextAnnotation(), { status: 200 });
  }),

  // Authenticated GET
  http.get('*/annotate/all', () => {
    return HttpResponse.json(buildNextAnnotation(), { status: 200 });
  }),

  // Anonymous POST submission
  http.post('*/annotate/anonymous/:url_id', () => {
    return HttpResponse.json({ session_id: TEST_SESSION_ID }, { status: 200 });
  }),

  // Authenticated POST submission
  http.post('*/annotate/all/:url_id', () => {
    return HttpResponse.json({}, { status: 200 });
  }),

  // Anonymous-to-authenticated migration
  http.post('*/annotate/migrate', () => {
    return HttpResponse.json({}, { status: 200 });
  }),

  // Authenticated user contributions
  http.get('*/contributions/user', () => {
    return HttpResponse.json(
      {
        count_validated: 0,
        agreement: { record_type: 0, agency: 0, url_type: 0 }
      },
      { status: 200 }
    );
  })
];
