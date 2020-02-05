using Umbraco.Web;
using ProjectB.Models.Generated;

namespace ProjectB.Core.ViewModels.Shared
{
	public class ImageViewModel
	{
		public ImageViewModel(string url, string alternateText = null)
		{
			Url = url;
			AlternateText = alternateText;
		}

		public ImageViewModel(Image image) : this(image.Url())
		{ }

		public string Url { get; }
		public string AlternateText { get; }
	}
}
