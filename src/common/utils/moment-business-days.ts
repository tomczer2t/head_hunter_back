import * as moment from 'moment-business-days';

export const onlyBusinessDays = () => {
  moment.updateLocale('pl', {
    workingWeekdays: [1, 2, 3, 4, 5],
    dateFormat: 'DD/MM/YYYY',
  });
  return moment;
};
