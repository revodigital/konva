import { Shape, ShapeConfig } from '../Shape';
import { GetSet }             from '../types';
import { SceneContext }       from '../Context';
import { Factory }            from '../Factory';
import { _registerNode }      from '../Global';

export interface ExportVariableConfig extends ShapeConfig {
  variableName: string;
}

export class ExportVariable extends Shape<ExportVariableConfig> {
  variableName: GetSet<string, this>;

  _initFunc(config?: ExportVariableConfig) {
    super._initFunc(config);

    if(!this.width()) this.width(130);
    if(!this.height()) this.height(40);
    if(!this.fill()) this.fill('yellow');
    if(!this.stroke()) this.stroke('black');
    if(!this.strokeWidth()) this.strokeWidth(2);
  }

  _hitFunc(context) {
    var width = this.width(),
      height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
    context.drawRectBorders(this);
  }

  _sceneFunc(context: SceneContext) {
    // Draw f(x) indicator
    // Draw variable name
    if(this.hasFill() || this.hasStroke()) {
      context.beginPath();
      context.rect(0, 0, this.width(), this.height());
      context.closePath();
      context.fillStrokeShape(this);
      context.drawRectBorders(this);
    }

    const centerY = this.height() / 2 + 5;

    context.beginPath();
    context._context.font = 'bold italic 20px Courier New';
    context._context.fillStyle = 'black';
    const space = context.measureText('f(x)');
    context.fillText('f(x)', 10, centerY);
    context._context.font = '15px Arial';
    context.fillText(this.variableName(), space.width + 10, centerY);
    const s = context.measureText(this.variableName());

    // Resize evenly
    this.width(space.width + 10 + s.width + 5);
    context.closePath();
  }
}

/**
 * Get / set variable name
 */
Factory.addGetterSetter(ExportVariable, 'variableName');
ExportVariable.prototype.className = 'ExportVariable';
_registerNode(ExportVariable);