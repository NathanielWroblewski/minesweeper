$(document).ready(function() {
  var field = new Minesweeper.Models.Field({
    height:     8,
    width:      8,
    mineCount: 10
  })
  field.initialize()

  var game = new Minesweeper.Views.Game({
    el:  '.board',
    model: field
  })
  game.setListeners()
  game.render()
})
