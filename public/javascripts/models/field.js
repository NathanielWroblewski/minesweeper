namespace('Minesweeper.Models')

Minesweeper.Models.Field = function(options) {
  this.height    = options.height    || 8
  this.width     = options.width     || 8
  this.mineCount = options.mineCount || 10
  this.cellCount = this.width * this.height
  this.field     = []
  this.visited   = []

  this.initialize = function() {
    this.field = []

    for (var i = 0; i < this.cellCount; ++i) {
      this.field.push({ hidden: true, value: 0 })
    }

    this.placeMines()
    this.placeClues()
  }

  this.placeMines = function() {
    _.times(this.mineCount, function() {
      var randomIndex = Math.floor(Math.random() * this.cellCount)
      this.field[randomIndex] = { hidden: true, value: '*'}
    }.bind(this))
  }

  this.placeClues = function() {
    for (var i = 0; i < this.cellCount; ++i) {
      if (this.field[i].value !== '*') {
        this.field[i] = { hidden: true, value: this.minesNear(i) }
      }
    }
  }

  this.neighborsOf = function(index) {
    var neighbors = []
    if (this.valueAbove(index)) neighbors.push(this.indexAbove(index))
    if (this.valueBelow(index)) neighbors.push(this.indexBelow(index))
    if (this.valueLeft(index))  neighbors.push(this.indexLeft(index))
    if (this.valueRight(index)) neighbors.push(this.indexRight(index))
    if (this.valueUpLeft(index))    neighbors.push(this.indexUpLeft(index))
    if (this.valueUpRight(index))   neighbors.push(this.indexUpRight(index))
    if (this.valueDownLeft(index))  neighbors.push(this.indexDownLeft(index))
    if (this.valueDownRight(index)) neighbors.push(this.indexDownRight(index))
    return neighbors
  }

  this.indexAbove = function(index) {
    return index - this.width
  }

  this.indexBelow = function(index) {
    return index + this.width
  }

  this.indexLeft = function(index) {
    return index - 1
  }

  this.indexRight = function(index) {
    return index + 1
  }

  this.indexUpLeft = function(index) {
    return this.indexLeft(this.indexAbove(index))
  }

  this.indexUpRight = function(index) {
    return this.indexRight(this.indexAbove(index))
  }

  this.indexDownLeft = function(index) {
    return this.indexLeft(this.indexBelow(index))
  }

  this.indexDownRight = function(index) {
    return this.indexRight(this.indexBelow(index))
  }

  this.onLeftEdge = function(index) {
    return index % this.width === 0
  }

  this.onRightEdge = function(index) {
    return index % this.width === this.width - 1
  },

  this.valueAbove = function(index) {
    return this.field[this.indexAbove(index)]
  }

  this.valueBelow = function(index) {
    return this.field[this.indexBelow(index)]
  }

  this.valueLeft = function(index) {
    if (!this.onLeftEdge(index)) return this.field[this.indexLeft(index)]
  }

  this.valueRight = function(index) {
    if (!this.onRightEdge(index)) return this.field[this.indexRight(index)]
  }

  this.valueUpLeft = function(index) {
    if (!this.onLeftEdge(this.indexAbove(index))) {
      return this.field[this.indexUpLeft(index)]
    }
  }

  this.valueUpRight = function(index) {
    if (!this.onRightEdge(this.indexAbove(index))) {
      return this.field[this.indexUpRight(index)]
    }
  }

  this.valueDownLeft = function(index) {
    if (!this.onLeftEdge(this.indexBelow(index))) {
      return this.field[this.indexDownLeft(index)]
    }
  }

  this.valueDownRight = function(index) {
    if (!this.onRightEdge(this.indexBelow(index))) {
      return this.field[this.indexDownRight(index)]
    }
  }

  this.minesNear = function(index) {
    var occurrences = _.filter(this.neighborsOf(index), function(neighbor) {
      return this.mineAt(neighbor)
    }.bind(this))
    return occurrences.length
  }

  this.show = function(index) {
    this.field[index].hidden = false
    if (this.field[index].value === 0) {
      this.visited = []
      this.revealBorder(index)
    }
  }

  this.revealBorder = function(index) {
    if (this.field[index].value !== 0) return false
    var unvisitedNeighbors = _.difference(this.neighborsOf(index), this.visited)
    _.each(unvisitedNeighbors, function(neighbor) {
      this.field[neighbor].hidden = false
      this.visited.push(neighbor)
      this.revealBorder(neighbor)
    }.bind(this))
  }

  this.mineAt = function(index) {
    return this.field[index].value === '*'
  }

  this.cleared = function(index) {
    var hiddenField = _.filter(this.field, function(cell) {
      return cell.value !== '*' && cell.hidden
    })
    return (hiddenField.length > 0 ? false : true)
  }

  this.toJSON = function() {
    return { field: this.field }
  }
}
