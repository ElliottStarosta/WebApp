import React, { useState } from 'react';
import { Users, Plus, ChevronDown } from 'lucide-react';
import { useGroup } from '../../context/GroupContext';
import CreateGroup from './CreateGroup';

function GroupSelector() {
  const { activeGroup, setActiveGroup, userGroups } = useGroup();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (userGroups.length === 0) {
    return (
      <>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Create Group</span>
        </button>

        {showCreateModal && (
          <CreateGroup onClose={() => setShowCreateModal(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          <Users className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-800">{activeGroup?.name}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
            <div className="max-h-80 overflow-y-auto">
              {userGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveGroup(group);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-all ${
                    activeGroup?.id === group.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <p className="font-medium text-gray-800">{group.name}</p>
                  <p className="text-xs text-gray-500">
                    {group.members?.length} members
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowCreateModal(true);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 border-t border-gray-200 text-purple-600 font-medium hover:bg-purple-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Group
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateGroup onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}

export default GroupSelector;