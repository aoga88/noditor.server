function User($http, $q) {
	return {
		find: function(conditions) {
			var defer = $q.defer();
			$http.post('/api/user/find', conditions)
			.success(function(data) {
				defer.resolve(data);
			})
			.error(function(data) {
				defer.reject(data);
			});

			return defer.promise;
		},

		login: function(conditions) {
			var defer = $q.defer();
			var obj = conditions;
			obj.password = SHA1(obj.password);
			$http.post('/api/user/login', obj)
			.success(function(data) {
				defer.resolve(data);
			})
			.error(function(data) {
				defer.reject(data);
			});

			return defer.promise;
		},

		save: function(conditions, document) {
			var defer = $q.defer();
			$http.post('/api/user', {
				conditions: conditions,
				document: document})
			.success(function(data) {
				defer.resolve(data);
			})
			.error(function(data) {
				defer.reject(data);
			});

			return defer.promise;
		},
	}
};