// @ts-nocheck
import React from 'react';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';

export const ExportExcel = ({ dataSource, fileName, wscols }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const headers = [{ email: 'Email', topics: 'Subscribed Topics' }];

  const exportToCSV = (dataSource, fileName, wscols) => {
    const ws = XLSX.utils.json_to_sheet(headers, {
      header: ['email', 'topics'],
      skipHeader: true,
      origin: 0, //ok
    });
    ws['!cols'] = wscols;
    XLSX.utils.sheet_add_json(ws, dataSource, {
      header: ['email', 'topics'],
      skipHeader: true,
      origin: -1, //ok
    });
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      type="primary"
      icon={<FileExcelOutlined />}
      style={{ marginRight: 10 }}
      onClick={() => exportToCSV(dataSource, fileName, wscols)}
    >
      Export
    </Button>
  );
};
