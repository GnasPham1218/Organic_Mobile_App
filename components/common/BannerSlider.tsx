import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  FlatListProps,
  Image,
  ImageSourcePropType,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type BannerSliderProps = {
  images: ImageSourcePropType[];
  height?: number;
  borderRadius?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  onIndexChange?: (index: number) => void;
  onPressItem?: (index: number) => void;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
};

const BannerSlider: React.FC<BannerSliderProps> = ({
  images,
  height = 160,
  borderRadius = 14,
  autoPlay = true,
  autoPlayInterval = 3000,
  loop = true,
  showDots = true,
  showArrows = true,
  onIndexChange,
  onPressItem,
  resizeMode = "cover",
}) => {
  const listRef = useRef<FlatList<ImageSourcePropType>>(null);

  // Fallback width trước khi onLayout chạy
  const windowWidth = useRef(Dimensions.get("window").width).current;
  const [width, setWidth] = useState(windowWidth);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // ===== Autoplay =====
  useEffect(() => {
    if (!autoPlay || images.length <= 1 || width === 0) return;
    const timer = setInterval(() => {
      const curr = indexRef.current;
      const next = curr + 1;
      if (next < images.length) scrollTo(next);
      else if (loop) scrollTo(0);
    }, autoPlayInterval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayInterval, width, images.length, loop]);

  const scrollTo = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
    onIndexChange?.(i);
  };

  // ===== Cập nhật index tin cậy bằng offset =====
  const commitIndexFromOffset = (offsetX: number) => {
    const w = width || windowWidth || 1;
    const i = Math.round(offsetX / w);
    if (i !== index) {
      setIndex(i);
      onIndexChange?.(i);
    }
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    commitIndexFromOffset(e.nativeEvent.contentOffset.x);
  };

  // (Tuỳ chọn) phụ trợ viewability — có cũng được, không cũng không sao
  const onViewableItemsChanged =
    useRef<FlatListProps<ImageSourcePropType>["onViewableItemsChanged"]>(
      (info) => {
        const first = info.viewableItems[0];
        if (first?.index != null) {
          setIndex(first.index);
          onIndexChange?.(first.index);
        }
      }
    ).current;

  const viewabilityConfig =
    useRef<FlatListProps<ImageSourcePropType>["viewabilityConfig"]>({
      viewAreaCoveragePercentThreshold: 60,
    }).current;

  const renderItem = useCallback(
    ({ item, index: itemIndex }: ListRenderItemInfo<ImageSourcePropType>) => {
      return (
        <Pressable
          style={{ width }}                 // 🔴 ÉP RÕ ràng bề rộng ITEM
          className="h-full"
          onPress={() => onPressItem?.(indexRef.current)}
          android_ripple={{ color: "rgba(0,0,0,0.08)" }}
        >
          <Image source={item} resizeMode={resizeMode} style={{ width, height }} />
        </Pressable>
      );
    },
    [height, onPressItem, resizeMode, width]
  );

  return (
    <View
      className="relative w-full"
      style={{ height, borderRadius, overflow: "hidden" }}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width || windowWidth;
        if (w !== width) setWidth(w);
      }}
    >
      <FlatList
        ref={listRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, i) => `banner-${i}`}
        horizontal
        pagingEnabled                 // ✅ chỉ dùng pagingEnabled (bỏ snapToInterval)
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, i) => {
          const w = width || windowWidth || 1;
          return { length: w, offset: w * i, index: i };
        }}
        extraData={width}
        initialNumToRender={1}
        windowSize={3}
        removeClippedSubviews={false} // 🔴 tránh cắt item chưa render
      />

      {/* Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <Pressable
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-2"
            onPress={() => {
              const prev = indexRef.current - 1;
              scrollTo(prev >= 0 ? prev : images.length - 1);
            }}
            hitSlop={10}
          >
            <FontAwesome name="chevron-left" size={16} color="#fff" />
          </Pressable>
          <Pressable
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-2"
            onPress={() => {
              const next = indexRef.current + 1;
              scrollTo(next < images.length ? next : 0);
            }}
            hitSlop={10}
          >
            <FontAwesome name="chevron-right" size={16} color="#fff" />
          </Pressable>
        </>
      )}

      {/* Dots */}
      {showDots && images.length > 1 && (
        <View className="absolute bottom-2 left-0 right-0 items-center">
          <View className="flex-row gap-1.5 bg-black/20 px-2 py-1 rounded-full">
            {images.map((_, i) => {
              const active = i === index;
              return (
                <View
                  key={`dot-${i}`}
                  className={`h-1.5 rounded-full ${
                    active ? "w-4 bg-white" : "w-1.5 bg-white/70"
                  }`}
                />
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default BannerSlider;
