import React, { useEffect, useId, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const RichTextField = ({ options, field, form, itemRef, showField }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (field.value) {
      setValue(field.value);
    }
  }, [field.value]);

  const handleChange = (value) => {
    form.setFieldValue(field.name, value);
    setValue(value);
  };

  return (
    <Editor
      onEditorChange={handleChange}
      value={value || ''}
      apiKey={'s0bs8snu2u6qo8skn5r3kurkerhbaagpsgm9cdkbxnbo8nj4'}
      init={{
        plugins:
          'advlist autolink lists link image charmap print preview anchor' +
          'searchreplace visualblocks code fullscreen' +
          'insertdatetime media table paste help wordcount',
        toolbar:
          'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | code',
      }}
    />
  );
};
