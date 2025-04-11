# Storda Performance Optimization Guidelines

This document outlines the performance optimizations implemented in the Storda app along with best practices for maintaining and improving performance.

## Implemented Optimizations

### 1. State Management
- **Selectors**: The store implementation uses fine-grained selectors to prevent unnecessary re-renders
- **Memoization**: Components memoize derived data to avoid expensive recalculations
- **Persistence**: Store data is persisted using efficient async storage

### 2. UI Components
- **Memoization**: All components are memoized using React.memo() to prevent unnecessary re-renders
- **List Virtualization**: FlatLists are optimized with proper configurations
- **Optimized Modals**: Modal components are rendered conditionally and leverage performance best practices
- **Component Splitting**: Complex screens are split into smaller, focused components

### 3. Build & Runtime Optimizations
- **Metro Bundler**: Configured for optimal performance with parallel processing
- **Hermes Engine**: JavaScript engine optimized for React Native
- **Device Detection**: Low-end device detection to scale features appropriately
- **Production Optimizations**: Console statements removal, dead code elimination, etc.

## Best Practices for Developers

### 1. Component Development
- Always use `useCallback` for event handlers to prevent unnecessary re-renders
- Use `useMemo` for expensive calculations or derivations
- Extract large components into smaller, focused components
- Use `React.memo()` for components that don't need to re-render often
- Avoid anonymous function props (use `useCallback` instead)

```javascript
// AVOID
<Button onPress={() => handlePress(id)} />

// PREFER
const handlePressCallback = useCallback(() => handlePress(id), [id]);
<Button onPress={handlePressCallback} />
```

### 2. Lists and Large Data Sets
- Always use FlatList instead of map() for rendering lists
- Provide proper `keyExtractor` functions
- Implement `getItemLayout` when possible for fixed-height items
- Use `removeClippedSubviews={true}` for large lists
- Implement pagination for API calls

```javascript
// Optimized FlatList configuration
<FlatList
  data={data}
  keyExtractor={item => item.id.toString()}
  renderItem={renderItem}
  initialNumToRender={8}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  updateCellsBatchingPeriod={50}
/>
```

### 3. State Management
- Use the provided selectors to access only the state you need
- Avoid accessing large objects when only needing a small part
- Use appropriate normalization for complex data structures
- Debounce user inputs that trigger state updates

```javascript
// AVOID
const allDevices = useDeviceStore(state => state.devices);
const myDevice = allDevices.find(d => d.id === deviceId);

// PREFER
const myDevice = useDeviceStore(state => state.getDeviceById(deviceId));
```

### 4. Images and Assets
- Use appropriate image sizes (don't load large images for small displays)
- Use proper image caching mechanisms
- Leverage static resources when possible
- Consider lazy loading for non-critical assets

### 5. Animations
- Use the native driver when possible (`useNativeDriver: true`)
- Reduce animation complexity on low-end devices
- Use Reanimated for complex animations
- Avoid running animations while scrolling

```javascript
// Check device capability before applying complex animations
import { isLowEndDevice } from '../utils/performance';

const animationDuration = isLowEndDevice() ? 150 : 300;
```

### 6. Network and API Calls
- Implement proper caching for API responses
- Use pagination and limit the amount of data loaded at once
- Implement request cancellation for abandoned screens
- Show loading states and skeleton screens while fetching data

### 7. Testing Performance
- Use the Performance utility functions in `app/utils/performance.ts`
- Monitor re-render counts using React DevTools
- Test on both high-end and low-end devices
- Use production builds for accurate performance testing

```javascript
// Measure function performance
import { measurePerformance } from '../utils/performance';

// Wrap expensive functions
const optimizedFunction = measurePerformance(expensiveFunction, 'ExpensiveOperation');
```

## Performance Monitoring

- Regular performance audits are scheduled monthly
- Address performance regressions promptly
- Performance metrics are tracked in the CI/CD pipeline
- Test on representative device categories (low, medium, high)

## Additional Resources

- [React Native Performance Guide](https://reactnative.dev/docs/performance)
- [Expo Performance Documentation](https://docs.expo.dev/guides/performance/)
- [Flipper for React Native Debugging](https://fbflipper.com/) 