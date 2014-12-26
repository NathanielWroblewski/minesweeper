namespace('Minesweeper.Views')

Minesweeper.Views.Game = function(options) {
  this.model    = options.model
  this.el       = options.el
  this.$el      = $(this.el)
  this.gameOver = false
  this.win      = false

  this.setListeners = function() {
    this.$el.on('click', 'div', function(e) {
      if (!this.gameOver) {
        this.show($(e.target))
        this.render()
      }
    }.bind(this))
  }

  this.show = function($clickedNode) {
    var index = this.$el.find('div').index($clickedNode)
    this.model.show(index)
    this.checkWinCondition(index)
  }

  this.classFor = function(value) {
    switch(value) {
      case   0: return 'zero' ; break
      case   1: return 'one'  ; break
      case   2: return 'two'  ; break
      case   3: return 'three'; break
      case   4: return 'four' ; break
      case   5: return 'five' ; break
      case   6: return 'six'  ; break
      case   7: return 'seven'; break
      case   8: return 'eight'; break
      case '*': return 'mine' ; break
    }
  }

  this.valueFor = function(value) {
    if (value === 0) {
      return ''
    } else {
      return value
    }
  }

  this.checkWinCondition = function(index) {
    if (this.model.mineAt(index)) {
      this.gameOver = true
      this.win      = false
    }
    if (this.model.cleared()) {
      this.gameOver = true
      this.win      = true
    }
  }

  this.template = function(model) {
    var template = ''
    for (cell of model.field) {
      if (this.gameOver && !this.win || !cell.hidden) {
        template += '<div class="' + this.classFor(cell.value) + '">' +
          this.valueFor(cell.value) + '</div>'
      } else {
        template += '<div></div>'
      }
    }
    if (this.gameOver && !this.win) template+= '<h2>GAME OVER</h2>'
    if (this.gameOver && this.win)  template+= '<h2>YOU WIN!</h2>'
    return template
  }

  this.render = function() {
    this.$el.html(this.template(this.model.toJSON()))
  }
}
