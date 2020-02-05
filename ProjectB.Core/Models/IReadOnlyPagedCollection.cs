using System.Collections.Generic;

namespace ProjectB.Core.Models
{
	public interface IReadOnlyPagedCollection<out T>
	{
		IReadOnlyList<T> Items { get; }
		IPagination Pagination { get; }
	}
}
