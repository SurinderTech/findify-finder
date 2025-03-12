
import React from 'react';
import ItemSubmissionForm from '../components/items/ItemSubmissionForm';

const SubmitLostItem = () => {
  return (
    <div className="container px-4 mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Report a Lost Item</h1>
        <p className="text-gray-600 mb-8">
          Please provide as much detail as possible about your lost item to help us find it.
          Adding a clear image will significantly increase the chances of matching with found items.
        </p>
        <ItemSubmissionForm type="lost" />
      </div>
    </div>
  );
};

export default SubmitLostItem;
