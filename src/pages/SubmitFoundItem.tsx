
import React from 'react';
import ItemSubmissionForm from '../components/items/ItemSubmissionForm';

const SubmitFoundItem = () => {
  return (
    <div className="container px-4 mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Report a Found Item</h1>
        <p className="text-gray-600 mb-8">
          Thank you for reporting a found item! Please provide as much detail as possible
          to help us match it with someone who has lost it. Your good deed could earn you
          rewards through our program.
        </p>
        <ItemSubmissionForm type="found" />
      </div>
    </div>
  );
};

export default SubmitFoundItem;
