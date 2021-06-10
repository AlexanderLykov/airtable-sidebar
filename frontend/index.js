import React from "react";
import {
  Box,
  Heading,
  initializeBlock,
  useBase,
  useRecords,
  useViewMetadata,
  useWatchable,
  CellRenderer,
  Label,
  useCursor,
} from "@airtable/blocks/ui";

function TableStructureApp() {
  const base = useBase();
  const cursor = useCursor();
  useWatchable(cursor, ["activeTableId", "activeViewId"]);

  const table = base.getTableByIdIfExists(cursor.activeTableId);
  const view = table && table.getViewByIdIfExists(cursor.activeViewId);

  if (table && view) {
    return <TableSchema base={base} table={table} view={view} />;
  } else {
    return null;
  }
}

function TableSchema({ base, table, view }) {
  const viewMetadata = useViewMetadata(view);
  const recordsQueryResult = view.selectRecords();
  const records = useRecords(recordsQueryResult);

  return (
    <Box>
      <Box padding={3} borderBottom="thick">
        <Heading size="small" margin={0}>
          {table.name} / {view.name}
        </Heading>
      </Box>
      {records.map((record) => (
        <Box key={record._id} padding={3} borderBottom="thick">
          {viewMetadata.visibleFields.map((field) => {
            return (
              <FieldRow
                base={base}
                table={table}
                record={record}
                field={field}
                key={field.id}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

function FieldRow({ field, record }) {
  return (
    <Box marginTop={"16px"} flex="none" paddingRight={1}>
      <Label fontWeight="strong">{field.name}</Label>
      <CellRenderer field={field} record={record} />
    </Box>
  );
}

initializeBlock(() => <TableStructureApp />);
