using System;
using System.Text;

namespace ProjectB.Common.Extensions
{
	public static class StringBuilderExtensions
	{
		public static StringBuilder TryAppendLine(this StringBuilder builder, string value)
		{
			if (builder == null) throw new ArgumentNullException(nameof(builder));
			if (string.IsNullOrWhiteSpace(value)) return builder;

			return builder.AppendLine(value);
		}
	}
}
