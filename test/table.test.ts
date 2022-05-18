import { TableBuilder } from '../src/builders/TableBuilder';
import { RowBuilder }   from '../src/builders/RowBuilder';
import Pamela           from '../src';
import { Table }                  from '../src/shapes/Table';
import { matrixOf, matrixRepeat } from '../src/common/Matrix2D';

it('should correctly return only the content of this table', () => {
  const table = new TableBuilder();
  table.addRow({
    row: RowBuilder.withCells(100, {
      bold: true,
      content: 'hello',
    }).autoWidth().autoHeight()
  });

  const onlyContent = table.buildContent();
  expect(table.buildContent()).toBeDefined();
  expect(onlyContent.getRowsCount()).toEqual(1);
  expect(onlyContent.getColumnsCount()).toEqual(100);

  onlyContent.forEachRow(row => {
    row.forEach(cell => expect(cell).toEqual('hello'));
  });
});

it('The table should be correctly stored into JSON', () => {
  const table = TableBuilder.withCells(20, 20, {
    width: 100, height: 100,
  }).build();

  const json = table.toJSON();
  const table2 = Pamela.Node.create(json) as Table;

  expect(json).toBeDefined();
  expect(table2).toBeDefined();
  expect(table2.getColumnsCount()).toEqual(20);
  expect(table2.getRowsCount()).toEqual(20);
});

it('Should correctly operate this table', () => {
  const table1 = TableBuilder.withCells(30, 30, {
    fill: 'blue'
  }, {
    content: 'hello',
    fill: 'red'
  }).build();

  const builder = table1.toBuilder();
  builder.addRow({
    row: RowBuilder.withCells(20, {
      fill: 'orange'
    })
  });

  builder.populateContent(matrixRepeat('test', 30, 30))

  const tableCells = matrixOf(table1.cells());
  expect(tableCells.getRowsCount()).toEqual(30);
  expect(builder.getRowsCount()).toEqual(31);

  expect(tableCells.firstColumn()[0].content).toEqual('hello')
});