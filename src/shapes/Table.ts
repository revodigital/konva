/*
 * Copyright (c) 2021-2022. Revo Digital
 * ---
 * Author: gabriele
 * File: Table.ts
 * Project: pamela
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Shape, ShapeConfig } from '../Shape';
import { _registerNode }      from '../Global';
import { SceneContext }       from '../Context';
import { BorderConfig }       from '../configuration/BorderOptions';
import { GetSet }             from '../types';
import { Factory }            from '../Factory';
import { Cell, CellConfig }   from './cell';
import { pointOf }            from '../common/Point2D';
import { Matrix2D }           from '../common/Matrix2D';
import { PointRectangle2D }   from '../common/PointRectangle2D';

export interface TableConfig extends ShapeConfig {
  cells?: Matrix2D<CellConfig>;
}

/**
 * Represents a table
 */
export class Table extends Shape<TableConfig> {
  /**
   * Contains all the cells of this Table
   */
  cells: GetSet<Matrix2D<CellConfig>, this>;

  private _sceneFunc(context: SceneContext) {
    // Render content
    this._renderContent(context);

    // Draw background
    context.beginPath();
    context.rect(0, 0, this.width(), this.height());
    context.fillStrokeShape(this);
    context.closePath();
  }

  private _hitFunc(context) {
    var width = this.width(),
      height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
  }

  /**
   * Renders the content of this table (effective data)
   * @param ctx The drawing context
   * @param layout Content layout
   * @private
   */
  private _renderContent(ctx: SceneContext): void {
    // Drawing start point
    let startingPoint = pointOf(0, 0);

    let offsetY = 0;
    const width = this.width();
    const height = this.height();

    this.cells().forEachRow(it => {
      let offsetX = 0;

      it.forEach(cell => {
        const topLeft = startingPoint.translated({
          x: offsetX,
          y: offsetY
        });
        const cellRenderer = new Cell(cell,
          PointRectangle2D.fromStartPoint(topLeft,
            (cell.width / 100) * width,
            (cell.height / 100) * height));
        cellRenderer._render(ctx);

        offsetX += (cell.width / 100) * width;
      });

      console.log(it[0]);
      offsetY += (it[0].height / 100) * height;
    });
  }
}

/**
 * Get / set table cells
 */
Factory.addGetterSetter(Table, 'cells');

Table.prototype.className = 'Table';

// Register this new shape
_registerNode(Table);