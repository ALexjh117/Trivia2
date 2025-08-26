import router from '@adonisjs/core/services/router'

router.group(() => {
  // --------------------
  // Salas
  // --------------------

  // crear sala
  router.post('/rooms', [() => import('#controllers/rooms_controller'), 'create'])
  // unirse a la sala //
  router.post('/rooms/:code/join', [() => import('#controllers/rooms_controller'), 'join'])
  router.get('/rooms/:code', [() => import('#controllers/rooms_controller'), 'show'])

  // --------------------
  // Preguntas
  // --------------------
  router.get('/rooms/:code/next-question', [
    () => import('#controllers/questions_controller'),
    'next',
  ])

  router.post('/rooms/:code/questions', [
    () => import('#controllers/questions_controller'),
    'create',
  ])

  // --------------------
  // Respuestas y evaluación
  // --------------------
  router.post('/answers/evaluate', [() => import('#controllers/answers_controller'), 'evaluate'])

  // --------------------
  // Jugadores
  // --------------------

  router.post('/create-player', [() => import('#controllers/player_controller'), 'create'])
  router.get('/players/:id', [() => import('#controllers/player_controller'), 'show'])
  router.get('/rooms/:roomId/players', [
    () => import('#controllers/player_controller'),
    'listByRoom',
  ])

  // --------------------
  // Scoreboard
  // --------------------
  router.get('/rooms/:roomId/score', [() => import('#controllers/score_controller'), 'show'])
})
