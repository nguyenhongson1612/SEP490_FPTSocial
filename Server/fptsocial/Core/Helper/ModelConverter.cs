using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Core.Helper
{
    public static class ModelConverter
    {
        public static TDestination Convert<TSource, TDestination>(TSource source)
            where TDestination : new()
        {
            if (source == null)
            {
                return default(TDestination);
            }

            var destination = new TDestination();
            var sourceProperties = typeof(TSource).GetProperties();
            var destinationProperties = typeof(TDestination).GetProperties();

            foreach (var sourceProp in sourceProperties)
            {
                foreach (var destProp in destinationProperties)
                {
                    if (sourceProp.Name == destProp.Name && destProp.CanWrite)
                    {
                        var sourceValue = sourceProp.GetValue(source, null);

                        // Kiểm tra và xử lý các thuộc tính dạng collection
                        if (typeof(IEnumerable).IsAssignableFrom(sourceProp.PropertyType) && sourceProp.PropertyType != typeof(string))
                        {
                            var itemType = destProp.PropertyType.GetGenericArguments().FirstOrDefault();
                            if (itemType != null)
                            {
                                var method = typeof(ModelConverter).GetMethod(nameof(ConvertCollection), BindingFlags.Static | BindingFlags.NonPublic);
                                var genericMethod = method.MakeGenericMethod(sourceProp.PropertyType.GetGenericArguments().First(), itemType);
                                var convertedCollection = genericMethod.Invoke(null, new object[] { sourceValue });
                                destProp.SetValue(destination, convertedCollection);
                            }
                        }
                        else
                        {
                            destProp.SetValue(destination, sourceValue);
                        }

                        break;
                    }
                }
            }

            return destination;
        }

        private static ICollection<TDestination> ConvertCollection<TSource, TDestination>(IEnumerable<TSource> source)
            where TDestination : new()
        {
            if (source == null)
            {
                return null;
            }

            var destination = new List<TDestination>();

            foreach (var item in source)
            {
                destination.Add(Convert<TSource, TDestination>(item));
            }

            return destination;
        }

    }
}
