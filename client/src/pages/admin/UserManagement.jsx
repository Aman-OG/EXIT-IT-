import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, UserX, UserCheck } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Student Management</h1>
            <p className="text-text/70">Audit and track registered student profiles.</p>
          </div>
          
          <div className="relative w-full md:w-auto">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text/50">
               <Search size={18} />
             </div>
             <input 
               type="text" 
               placeholder="Search email or name..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-10 pr-4 py-2 w-full md:w-64 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
             />
          </div>
      </div>

      <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-background/50 dark:bg-neutral-800/20 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm text-text/60 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 font-semibold text-sm text-text/60 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 font-semibold text-sm text-text/60 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-sm text-text/60 uppercase tracking-wider">Account Role</th>
                <th className="px-6 py-4 font-semibold text-sm text-text/60 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/50">
               {filteredUsers.length === 0 ? (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-text/50">No students found matching your criteria.</td></tr>
               ) : (
                   filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 font-semibold">{u.name}</td>
                        <td className="px-6 py-4 text-text/80">{u.email}</td>
                        <td className="px-6 py-4 text-text/80">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                               {u.role}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-text/40 hover:text-warning transition p-2 rounded-lg hover:bg-warning/10" title="Disable User Action (Upcoming)">
                               <UserX size={18}/>
                           </button>
                        </td>
                      </tr>
                   ))
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagement;
