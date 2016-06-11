const refreshClickStream$ = Rx.Observable.fromEvent(
  document.querySelector('.refresh'),
  'click'
);

const requestStream$ = refreshClickStream$
  .startWith('startup click')
  .map(() =>
    [
      'http://smartjs.academy:10001?since=',
      ~~(Math.random() * 500)
    ].join('')
  )
;

requestStream$.subscribe(requestUrl => {
  const responseStream$ = Rx.Observable.fromPromise(
    fetch(requestUrl).then(r => r.json())
  );

  const s1Stream$ = responseStream$
    .map(users => users[Math.floor(
      Math.random() * users.length
    )])
  ;

  const s2Stream$ = responseStream$
    .map(users => users[Math.floor(
      Math.random() * users.length
    )])
  ;

  const s3Stream$ = responseStream$
    .map(users => users[Math.floor(
      Math.random() * users.length
    )])
  ;

  const suggestion1Stream$ = s1Stream$.merge(refreshClickStream$.map(() => null))
  const suggestion2Stream$ = s2Stream$.merge(refreshClickStream$.map(() => null))
  const suggestion3Stream$ = s3Stream$.merge(refreshClickStream$.map(() => null))


  suggestion1Stream$.subscribe(item => {
    const li = document.querySelectorAll('li')[0];
    li.textContent = item ? item.login : '';
  });

  suggestion2Stream$.subscribe(item => {
    const li = document.querySelectorAll('li')[1];
    li.textContent = item ? item.login : '';
  });

  suggestion3Stream$.subscribe(item => {
    const li = document.querySelectorAll('li')[2];
    li.textContent = item ? item.login : '';
  });

});
