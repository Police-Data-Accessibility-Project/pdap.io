export const REQUEST_URGENCY = {
  urgent: 'Urgent (Less than a week)',
  somewhat_urgent: 'Somewhat urgent (Less than a month)',
  not_urgent: 'Not urgent (A few months)',
  long_term: 'Long term (6 months or more)',
  indefinite_unknown: 'Indefinite/Unknown'
};

export const INPUT_NAMES = {
  title: 'title',
  area: 'area',
  range: 'coverage_range',
  target: 'request_urgency',
  notes: 'submission_notes',
  requirements: 'data_requirements'
};

export const SELECT_OPTS = [
  { value: 'urgent', label: 'Urgent (Less than a week)' },
  {
    value: 'somewhat_urgent',
    label: 'Somewhat urgent (Less than a month)'
  },
  {
    value: 'not_urgent',
    label: 'Not urgent (A few months)'
  },
  {
    value: 'long_term',
    label: 'Long term (6 months or more)'
  },
  { value: 'indefinite_unknown', label: 'Indefinite/Unknown' }
];

export const SCHEMA = [
  {
    name: INPUT_NAMES.title,
    validators: {
      required: {
        value: true,
        message: 'Please let us know what to call this request.'
      },
      maxLength: {
        value: 255,
        message: 'Title must be 255 characters or fewer.'
      }
    }
  },
  {
    name: INPUT_NAMES.range,
    validators: {
      required: {
        value: true,
        message: 'Please let us know a range of years to look for this data.'
      }
    }
  },
  {
    name: INPUT_NAMES.target,
    validators: {
      required: {
        value: true,
        message: "Please let us know when you'd like this request to be filled."
      }
    }
  },
  {
    name: INPUT_NAMES.notes,
    validators: {
      required: {
        value: true,
        message: 'Please let us know a little more about your request.'
      }
    }
  },
  {
    name: INPUT_NAMES.requirements,
    validators: {
      required: {
        value: true,
        message: 'Please let us know the requirements for this request.'
      }
    }
  }
];
