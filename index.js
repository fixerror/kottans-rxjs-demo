const fakeArray = Array.from({ length: 3});

const closeButtonStreamsArray = fakeArray.map((_, idx) => Rx.Observable.fromEvent(
    document.querySelectorAll('li')[idx].querySelector('.close'),
    'click'
  ).startWith(null))
;

const close1Stream$ = Rx.Observable.fromEvent(document.querySelector('.close'), 'click')
  .startWith(null)
;

const refreshClickStream$ = Rx.Observable.fromEvent(document.querySelector('.refresh'), 'click');

const requestStream$ = refreshClickStream$
  .startWith('startup click')
  .map(() => `http://smartjs.academy:10001?since=${~~(Math.random() * 500)}`)
;

requestStream$.subscribe(requestUrl => {
  const responseStream$ = Rx.Observable.fromPromise(
    fetch(requestUrl).then(r => r.json())
  );

  const suggestionStreams = fakeArray.map((_, idx ) =>
    closeButtonStreamsArray[idx]
      .combineLatest(responseStream$, (click, users) => users[Math.floor(
        Math.random() * users.length
      )])
      .startWith(null)
  );

  const spinner='<i class="fa fa-spin fa-spinner"></i>';

  fakeArray.map((_, idx) => suggestionStreams[idx].startWith(null).subscribe(item => {
    const p = document.querySelectorAll('li')[idx].querySelector('.name');
    p.innerHTML = item ? item.login : spinner;
  }));
});
