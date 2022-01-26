import { Shape, ShapeConfig } from '../Shape';
import { GetSet }             from '../types';
import { SceneContext }       from '../Context';
import { Factory }            from '../Factory';
import { _registerNode }      from '../Global';

export interface ExportVariableConfig extends ShapeConfig {
  variableName: string;
  assigned?: boolean;
  content?: string;
  hideFX?: boolean;
}

export class ExportVariable extends Shape<ExportVariableConfig> {
  variableName: GetSet<string, this>;
  assigned: GetSet<boolean, this>;
  content: GetSet<string, this>;
  hideFX: GetSet<boolean, this>;

  _initFunc(config?: ExportVariableConfig) {
    super._initFunc(config);

    if (!this.width()) this.width(130);
    if (!this.height()) this.height(40);
    if (!this.stroke()) this.stroke('black');
    if (!this.strokeWidth()) this.strokeWidth(2);
    if (this.assigned() === undefined) this.assigned(false);
    if (this.hideFX() === undefined) this.hideFX(false);
  }

  /**
   * Sets the value of a print variable. Disables all additional effects and redraws it.
   * Sets a transparent background and disables stroke
   * @param value The value to assign.
   */
  public assign(value: string) {
    this.content(value);
    this.fill('transparent');
    this.hideFX(true);
    this.assigned(true);
    this.strokeEnabled(false);
    this.draw();
  }

  _hitFunc(context) {
    var width = this.width(),
      height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
  }

  _sceneFunc(context: SceneContext) {
    // Draw f(x) indicator
    // Draw variable name
    if (this.hasFill() || this.hasStroke()) {
      context.beginPath();
      context.rect(0, 0, this.width(), this.height());
      context.closePath();
      context.fillStrokeShape(this);
    }

    const centerY = this.height() / 2 + 5;
    let space = 0;
    context.beginPath();

    context._context.fillStyle = 'black';
    if (!this.hideFX()) {
      context._context.font = 'bold italic 20px Times new Roman';
      space += context.measureText('f(x)').width;
      context.fillText('(x)', 10, centerY);
    }
    context._context.font = '15px Arial';

    let txt;
    if(this.assigned()) txt = this.content();
    else txt = this.variableName();

    context.fillText(txt, space + 10, centerY);
    const s = context.measureText(txt);

    // Resize evenly
    this.width(space + 10 + s.width + 5);
    context.closePath();
  }
}

/**
 * Get / set variable name
 */
Factory.addGetterSetter(ExportVariable, 'variableName');
Factory.addGetterSetter(ExportVariable, 'assigned');
Factory.addGetterSetter(ExportVariable, 'content');
Factory.addGetterSetter(ExportVariable, 'hideFX');

ExportVariable.prototype.className = 'ExportVariable';
_registerNode(ExportVariable);