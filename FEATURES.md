# Quick Reference: New Features & Components

## Using New Components in Your Code

### 1. SearchBar Component
```tsx
import SearchBar from '../components/SearchBar';

<SearchBar 
  onResultSelect={(result) => {
    if (result.type === 'material') {
      navigate(`/study/${result.material_id}`);
    } else if (result.type === 'quiz') {
      navigate(`/quiz/${result.id}`);
    }
  }}
/>
```

### 2. StreakFreeze Component
```tsx
import StreakFreeze from '../components/StreakFreeze';

<StreakFreeze 
  currentStreak={currentStreak} 
  streakFreeze={streakFreeze}
  onFreezeUsed={(data) => {
    setStreakFreeze(data.streakFreeze);
  }}
/>
```

### 3. Card Components
```tsx
import { Card, CardHeader, CardBody, CardFooter, StatCard, EmptyState } from '../components/Card';
import { BookOpen } from 'lucide-react';

// Simple card
<Card className="p-6">
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Stat card
<StatCard 
  icon={BookOpen}
  label="Overall Progress"
  value="75%"
  colorClass="bg-primary/10 text-primary"
/>

// Empty state
<EmptyState 
  icon={BookOpen}
  title="No Data"
  description="Start your first study session"
  action={() => navigate('/courses')}
  actionText="Browse Courses"
/>
```

### 4. Skeleton Loaders
```tsx
import { StatSkeleton, ResumeSkeleton, CourseSkeleton } from '../components/Skeleton';

{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map(i => <StatSkeleton key={i} />)}
  </div>
) : (
  // Your actual content
)}
```

## API Endpoints Reference

### Dashboard (Optimized Combined)
```
GET /api/analytics/dashboard
Response: {
  overallProgress, avgAccuracy, weakestSubject, currentStreak, streakFreeze,
  lastMaterial, examDate, daysUntilExam, examWarning
}
```

### Search Endpoints
```
GET /api/materials/search?q=react
GET /api/courses/search?q=biology
GET /api/quizzes/search?q=derivatives
```

### Streak Freeze
```
POST /api/users/use-freeze
Response: { success: true, streakFreeze: 0, message: "..." }
```

## Theme Usage

Use theme switcher in your app to toggle between modes:
```tsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const { theme, setTheme } = useContext(ThemeContext);

// Available themes: 'light', 'dark', 'study', 'eye'
setTheme('study'); // Enables sepia tones for reduced eye strain
```

## Styling with Shimmer

Add shimmer effect to any skeleton:
```tsx
<Skeleton className="w-32 h-8" shimmer />
<Skeleton className="w-full h-4" shimmer />
```

## Performance Tips

1. **Use Combined Dashboard Endpoint**: Instead of calling `/analytics/overview`, `/progress/last-accessed`, and `/settings`, use `/analytics/dashboard` for single request
2. **Debounced Search**: SearchBar automatically debounces (300ms) to reduce API calls
3. **Efficient Skeletons**: Shimmer animations use CSS, not JavaScript, for better performance
4. **Lazy Loading**: Search results limited to 10 results per query

## Common Patterns

### Complete Dashboard Setup
```tsx
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        // Handle data...
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div>
      {loading ? <StatSkeleton /> : <StatCard {...} />}
      {examWarning && <ExamWarning />}
      <StreakFreeze {...} />
    </div>
  );
};
```

### Search Integration
```tsx
<SearchBar onResultSelect={(result) => {
  switch(result.type) {
    case 'material':
      navigate(`/study/${result.material_id}`);
      break;
    case 'quiz':
      navigate(`/quiz/${result.id}`);
      break;
    case 'course':
      navigate(`/courses?id=${result.id}`);
      break;
  }
}} />
```

## Testing Improvements

1. **Test Dashboard Loading**: Verify skeleton loaders appear and disappear correctly
2. **Test Search**: Try searching for different keywords across materials, courses, quizzes
3. **Test Exam Warning**: Set exam date to within 7 days to see alert
4. **Test Streak Freeze**: Use freeze when streak is at risk, verify countdown doesn't break
5. **Test Themes**: Switch between light, dark, study, eye protection modes

## Browser DevTools Tips

1. Network tab: Verify single `/dashboard` request instead of 3 separate calls
2. Console: Check for any missing imports or component errors
3. Performance: Shimmer animations should run smoothly at 60fps
4. Lighthouse: Run audit to verify improved performance metrics

---

All new features are production-ready and follow EXIT-IT code conventions and design patterns.
