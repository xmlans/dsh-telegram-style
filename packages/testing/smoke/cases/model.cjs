'use strict'
const { check, basicChecks, same } = require('./_shared.cjs')

/** One row by the name its label carries. */
function byName(rows) {
  return (rows || []).reduce((all, row) => { all[row.name] = row; return all }, {})
}

module.exports = {
  /**
   * The model menu's rows: the seat's own row at the bottom of level 1 (whose
   * provider that level does not list), the list rows, and a level-2 row.
   */
  'model-meter'(r) {
    basicChecks(r)
    const meter = r.modelMeter || {}
    const levelOne = meter.levelOne || []
    const one = byName(levelOne)
    check('the picker draws level 1 with the seat\'s own row under the list',
      levelOne.length === 3 && one['V4.1 Flash'] !== undefined && one['Kimi K3'] !== undefined && one['GLM-5.3'] !== undefined,
      JSON.stringify(levelOne.map((row) => row.name)))
    check('the seat\'s row is the current one and the last of that level',
      meter.currentRow !== null && meter.currentRow !== undefined && meter.currentRow.current === true && meter.currentRow.name === 'GLM-5.3',
      JSON.stringify(meter.currentRow))
    const listed = one['V4.1 Flash']
    check('the seat\'s row is drawn as the list rows are: same height, padding, radius and layout',
      meter.currentRow !== null && meter.currentRow !== undefined && listed !== undefined &&
        same(meter.currentRow.box, listed.box),
      JSON.stringify({ current: meter.currentRow === null || meter.currentRow === undefined ? null : meter.currentRow.box, listed: listed === undefined ? null : listed.box }))
    const press = r.modelPress || {}
    check('with the hover preference on, a press on the open model menu keeps it up',
      press.opened === true && press.kept === true,
      JSON.stringify({ opened: press.opened, kept: press.kept }))
    const descriptions = r.modelDescriptions || {}
    check('every row of the first level carries a line saying what the model is while Model descriptions is on, and turning it off takes the line off that level alone',
      descriptions.listed === 3 && descriptions.lines === 3 &&
        descriptions.bareListed === 3 && descriptions.bareLines === 0 &&
        descriptions.secondLevelLines === 0 && descriptions.bareSecondLevelLines === 0,
      JSON.stringify(descriptions))
    // The picker's switch is live: its teardown hands the host's own seat and
    // menu back, and installing it again takes the seat over once more.
    const picker = r.modelPicker || {}
    check('switching the model picker off hands the host\'s own seat back, and on takes it over again',
      picker.off !== undefined && picker.off.trigger === false && picker.off.hostMarked === false &&
        picker.back !== undefined && picker.back.trigger === true && picker.back.hostMarked === true,
      JSON.stringify(picker))
  },
}
