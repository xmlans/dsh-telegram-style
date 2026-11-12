/**
 * The session list and binding each case's page carries: the mascot's own
 * session, the turn navigator's, the statistics case's key-addressed faces, the
 * turn fixture's bound session, the auto mode cases' command target, and the
 * list that throws for the sync-fault case, and the chat list case's three
 * sessions: one running, one waiting on the reader, one finished unread.
 */
(function () {
  var host = window.__dshSmokeHost
  var CASE = host.CASE
  var mascotFixture = host.mascotFixture
  var turnNav = host.turnNav
  var statsCase = host.statsCase
  var statsFixtureCase = host.statsFixtureCase
  var waitFixtureCase = host.waitFixtureCase
  var permissionFixture = host.permissionFixture
  var permissionCommands = host.permissionCommands

  // The chat list case: s-run is typing, s-ask waits on an approval, s-done has a reply not yet seen.
  var chatList = CASE === 'chat-list' ? (function () {
    var now = Date.now()
    var byId = {
      's-run': { id: 's-run', running: true, displayTitle: 'Running chat', updatedAt: now },
      's-ask': { id: 's-ask', running: false, displayTitle: 'Needs approval', updatedAt: now - 60000 },
      's-done': { id: 's-done', running: false, displayTitle: 'Finished chat', updatedAt: now - 3600000 },
    }
    var status = new Map([
      ['s-run', { running: true }],
      ['s-ask', { pendingInteraction: {} }],
      ['s-done', { completionUnread: true }],
    ])
    return {
      sessions: {
        list: { getSnapshot: function () { return { current: undefined, phase: 'ready', ids: ['s-run', 's-ask', 's-done'], byId: byId, projectionsBySession: {} } }, subscribe: function () { return function () {} } },
        binding: function () { return undefined },
      },
      uiSession: { sessionStatus: { getSnapshot: function () { return status }, subscribe: function () { return function () {} } } },
    }
  })() : undefined

  var sessions = chatList !== undefined ? chatList.sessions : mascotFixture !== undefined ? mascotFixture.sessions : turnNav !== undefined ? turnNav.sessions : statsFixtureCase ? statsCase.sessions : waitFixtureCase ? host.emptySessions(function (id) { return id === 'smoke-session' ? {} : undefined }) : CASE === 'sync-fault'
    ? { list: { getSnapshot: function () { throw new Error('session list unavailable') } }, binding: function () { return null } }
    : (permissionFixture !== undefined && permissionFixture.current !== null ? {
        list: { getSnapshot: function () { return { current: 'smoke-session', ids: [], byId: {}, projectionsBySession: {} } } },
        binding: function () {
          return {
            session: {
              projections: {
                faceOf: function () {
                  return { getSnapshot: function () { return { currentValue: permissionFixture.current } } }
                },
              },
              command: function (line) { permissionCommands.push(line); return undefined },
            },
          }
        },
      } : undefined)
  host.sessions = sessions
  host.chatList = chatList
})()
