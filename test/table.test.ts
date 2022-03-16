import { TableBuilder } from '../src/builders/TableBuilder';
import { RowBuilder }   from '../lib/builders/RowBuilder';

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
    row.forEach(cell => expect(cell).toEqual('hello'))
  })
});